// Password manager options
const passwordManagers = [
  {
    name: "Password Manager A",
    price: "Free",
    safety: 2.2,
    easeOfUse: 3.5,
    functionalities: 2.8,
    passwordExchange: "Yes",
    twoFactorAuth: "Yes",
    emergencyAccess: "No",
    documentVault: "Yes",
    customLocation: "No",
    openSource: "No",
    localStorage: "Yes",
    onlineStorage: "No",
    operatingSystem: ["macOS", "Windows", "Linux"]
  },
  {
    name: "Password Manager B",
    price: "Per year",
    safety: 9.0,
    easeOfUse: 1.0,
    functionalities: 1.5,
    passwordExchange: "Yes",
    twoFactorAuth: "Yes",
    emergencyAccess: "Yes",
    documentVault: "Yes",
    customLocation: "Yes",
    openSource: "Yes",
    localStorage: "Yes",
    onlineStorage: "Yes",
    operatingSystem: ["macOS", "Windows"]
  },
  {
  name: "Password Manager C",
  price: "Free",
  safety: 1.5,
  easeOfUse: 1.0,
  functionalities: 9.3,
  passwordExchange: "Yes",
  twoFactorAuth: "Yes",
  emergencyAccess: "No",
  documentVault: "Yes",
  customLocation: "No",
  openSource: "No",
  localStorage: "Yes",
  onlineStorage: "No",
  operatingSystem: ["macOS", "Windows", "Linux"]
  },
  {
  name: "Password Manager D",
  price: "Per year",
  safety: 1.2,
  easeOfUse: 2.8,
  functionalities: 9.0,
  passwordExchange: "Yes",
  twoFactorAuth: "Yes",
  emergencyAccess: "Yes",
  documentVault: "No",
  customLocation: "Yes",
  openSource: "Yes",
  localStorage: "Yes",
  onlineStorage: "Yes",
  operatingSystem: ["macOS", "Windows"]
  },
  {
  name: "Password Manager E",
  price: "Free",
  safety: 1.5,
  easeOfUse: 2.5,
  functionalities: 1.7,
  passwordExchange: "No",
  twoFactorAuth: "Yes",
  emergencyAccess: "Yes",
  documentVault: "Yes",
  customLocation: "Yes",
  openSource: "No",
  localStorage: "Yes",
  onlineStorage: "Yes",
  operatingSystem: ["Windows", "Linux"]
  },
  {
  name: "Password Manager F",
  price: "Per month",
  safety: 1.8,
  easeOfUse: 10.0,
  functionalities: 1.6,
  passwordExchange: "Yes",
  twoFactorAuth: "Yes",
  emergencyAccess: "Yes",
  documentVault: "Yes",
  customLocation: "No",
  openSource: "Yes",
  localStorage: "Yes",
  onlineStorage: "Yes",
  operatingSystem: ["macOS", "Windows"]
  },

];
const featureMap = {
  "password-exchange": "passwordExchange",
  "2fa": "twoFactorAuth",
  "emergency-access": "emergencyAccess",
  "document-vault": "documentVault",
  "custom-location": "customLocation",
  "open-source": "openSource"
};

// Function to calculate the recommendation score based on user input
function calculateRecommendationScore(userInput) {
  let easeOfUse = 0;
  let functionalities = 0;
  let safety = 0;

  // Calculate score based on familiarity with a password manager
  if (userInput.familiarity === "experienced") {
    safety += 2;
    functionalities += 2;
  } else if (userInput.familiarity === "average") {
    safety += 1;
    functionalities += 1;
    easeOfUse += 1;
  } else if (userInput.familiarity === "new") {
    easeOfUse += 3;
  }

  // Calculate score based on industry/sector
  if (userInput.industry === "technology") {
    functionalities += 3;
    safety += 3;
  } else if (userInput.industry === "financial") {
    safety += 3;
  } else if (userInput.industry === "healthcare") {
    safety += 3;
  }

  // Calculate score based on workforce size
  if (userInput.workforce === "0-10") {
    easeOfUse += 3;
  } else if (userInput.workforce === "10-50") {
    easeOfUse += 2;
    safety += 1;
  } else if (userInput.workforce === "50-200") {
    easeOfUse += 1;
    safety += 2;
    functionalities += 1;
  } else if (userInput.workforce === "200+") {
    safety += 3;
    functionalities += 1;
  }

  // Calculate score based on selected features
  for (const feature of userInput.features) {
    if (feature === "password-exchange") {
      functionalities += 1;
    } else if (feature === "2fa") {
      functionalities += 1;
    } else if (feature === "emergency-access") {
      functionalities += 1;
    } else if (feature === "document-vault") {
      functionalities += 1;
    } else if (feature === "custom-location") {
      functionalities += 1;
    } else if (feature === "open-source") {
      functionalities += 1;
    }
  }

  return { easeOfUse, functionalities, safety };
}

function getBestPasswordManager(userInput) {
  const recommendationScore = calculateRecommendationScore(userInput);
  let highestScore = 0;
  let bestCategory = '';

  // Find the category with the highest score
  for (const category in recommendationScore) {
    const score = recommendationScore[category];
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  }

  // Filter out password managers that meet all the selected features
  const eligibleManagers = passwordManagers.filter(manager => {
    for (const feature of userInput.features) {
      const managerFeature = featureMap[feature];
      if (manager[managerFeature] !== "Yes") {
        return false;
      }
    }

    // Include password manager if all required features are met
    return true;
  });

  // Sort the eligible password managers based on the highest score in the best category
  eligibleManagers.sort((a, b) => b[bestCategory] - a[bestCategory]);

  // Return the top three password managers
  return eligibleManagers.slice(0, 3);
}
function sendRecommendationsToServer(recommendations) {
  fetch('/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recommendations)
  })
  .then(response => response.json())
  .then(data => {
    window.location.href = data.redirect_url;
  });
}

document.getElementById('questionaryForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Extracting values from radio buttons
    const familiarity = document.querySelector('input[name="familiarity"]:checked').value;
    const industry = document.querySelector('input[name="industry"]:checked').value;
    const workforce = document.querySelector('input[name="workforce"]:checked').value;

    // Extracting selected values from checkboxes
    const passwordStorageElements = document.querySelectorAll('input[name="password-storage"]:checked');
    const passwordStorage = Array.from(passwordStorageElements).map(elem => elem.value);

    const featuresElements = document.querySelectorAll('input[name="features"]:checked');
    const features = Array.from(featuresElements).map(elem => elem.value);

    const osElements = document.querySelectorAll('input[name="os"]:checked');
    const os = Array.from(osElements).map(elem => elem.value);

    const userInput = {
        familiarity,
        industry,
        workforce,
        passwordStorage,
        features,
        os,
    };

    const recommendations = getBestPasswordManager(userInput);
    sendRecommendationsToServer(recommendations);
});
