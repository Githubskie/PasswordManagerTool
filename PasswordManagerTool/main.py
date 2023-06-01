from flask import Flask, render_template, request, jsonify, session, url_for

app = Flask(__name__, static_folder='static')
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.secret_key = 'supersecretkey'  # Replace this with a real secret key!

app.config['TEMPLATES_AUTO_RELOAD'] = True


# Serve the index page
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    bestManagers = request.get_json()  # get data from JavaScript
    session['bestManagers'] = bestManagers
    return jsonify({'redirect_url': url_for('results')})

# Serve the questionnaire page with the form
@app.route('/questionary')
def questionnaire():
    return render_template('questionary.html')

# Serve the result page with the recommendation
@app.route('/results')
def results():
    bestManagers = session.get('bestManagers', [])
    return render_template('results.html', bestManagers=bestManagers)

if __name__ == '__main__':
    app.run(port=5001)