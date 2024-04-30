import mimetypes
from flask import Flask, make_response, render_template, request, redirect, send_from_directory, url_for, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import os

# user database...use appropriate databases
users = {
    'makazbr0': {'password': 'woods123', 'upload_dir': './uploads/makazbr0'},
    'mustafa': {'password': 'woods101', 'upload_dir': './uploads/mustafa'},
    'debbie': {'password': 'woods120', 'upload_dir': './uploads/debbie'}
}


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
login_manager = LoginManager()
login_manager.init_app(app)

# if not os.path.exists(upload_dir):
#     os.makedirs(upload_dir)

class User(UserMixin):
    def __init__(self, username, password, upload_dir):
        self.id = username
        self.password = password
        self.upload_dir = upload_dir

    def get_id(self):
        return self.id
    
    def get_upload_dir(self):
        return self.upload_dir


# Get user from username
def get_user(username):
    return users.get(username)

def get_current_user_upload_folder():
    return current_user


@login_manager.user_loader
def load_user(username):
    user = get_user(username)
    if user:
        return User(username, user['password'], user['upload_dir'])
    return None


@app.route('/login', methods=['GET', 'POST'])
def login():
    global upload_dir
    if request.method == 'POST':
        print("data from client", request.json)
        username = request.json.get('username')
        password = request.json.get('password')
        user = get_user(username)
        if user and user['password'] == password:
            login_user(User(username, password, user['upload_dir']))
            upload_dir = user['upload_dir']
            redirect(url_for('home'))
            return {'message': 'login successful'}
        else:
            return {'message' : 'Invalid username or password!'}
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/content/<path:filename>')
def get_content(filename):
    shared_dir = os.path.join(upload_dir, 'shared')
    possible_paths = [os.path.join(upload_dir, filename), os.path.join(shared_dir, filename)]

    # Tdo: optimize this file search process
    for full_path in possible_paths: 
        if os.path.isfile(full_path):
            try:
                with open(full_path, 'rb') as f: 
                    file_data = f.read()
                # Get content type using mimetypes library or custom logic
                content_type = mimetypes.guess_type(filename)[0] 
                if not content_type:
                    content_type = 'application/octet-stream'  # Default for unknown types
                response = make_response(file_data)
                response.mimetype = content_type
                return response
            except FileNotFoundError:
                return make_response('File not found!', 404)
            except Exception as e:
                return make_response(f'Error retrieving file content: {str(e)}', 500)
        else:
            # Handle folders: list folder contents
            folder_contents = [f for f in os.listdir(full_path) if os.path.isfile(os.path.join(full_path, f))]
            return jsonify({"type": "folder", "contents": folder_contents})

@app.route('/upload', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        filename = uploaded_file.filename
        uploaded_file.save(os.path.join(upload_dir, filename))
        return f'File {filename} uploaded successfully!'
    else:
        return 'No file selected!', 400


@app.route('/fileList')
def get_file_list():
    # Get all entries from upload directory of current user
    entries = os.listdir(upload_dir)
    
    # Differentiate between files and folders
    files_and_folders = []
    for entry in entries:
        if entry == 'shared':
            continue  # Skip "private" folder
        full_path = os.path.join(upload_dir, entry)
        is_file = os.path.isfile(full_path)
        files_and_folders.append({
            "name": entry,
            "type": "file" if is_file else "folder",
            "url": f"/content/{entry}",  # Add URL for getting content
            "owner": "me",
            "location": "My Drive",
        })
    return jsonify(files_and_folders)

@app.route('/sharedFileList')
def get_shared_file_list():
    # Get all entries from upload directory of current user
    shared_folder = os.path.join(upload_dir, 'shared')
    entries = os.listdir(shared_folder)
    
    # Differentiate between files and folders
    files_and_folders = []
    for entry in entries:
        full_path = os.path.join(upload_dir, entry)
        is_file = os.path.isfile(full_path)
        files_and_folders.append({
            "name": entry,
            "type": "file" if is_file else "folder",
            "url": f"/content/{entry}",  # Add URL for getting content
            "owner": "someone_else", ## implement
            "location": "Shared with me",
        })
    return jsonify(files_and_folders)

app.static_folder = 'static'  # Define the static folder directory

if __name__ == '__main__':
    app.run(debug=True)
