from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os
import pandas as pd
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# File upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'xls', 'xlsx', 'csv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'studentssms')
}

def init_db():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_config['database']}")
        cursor.execute(f"USE {db_config['database']}")
        
        # Create students table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                department VARCHAR(50) DEFAULT 'IT',
                grade VARCHAR(20) NOT NULL,
                status ENUM('active', 'pending') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create calendar events table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS calendar_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT,
                event_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create assignments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS assignments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT,
                due_date DATE NOT NULL,
                teacher_id INT NOT NULL,
                department VARCHAR(50) NOT NULL,
                status ENUM('active', 'completed') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create chat messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                sender_type ENUM('teacher', 'student') NOT NULL,
                receiver_id INT NOT NULL,
                receiver_type ENUM('teacher', 'student') NOT NULL,
                message TEXT NOT NULL,
                assignment_id INT,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX (sender_id, sender_type),
                INDEX (receiver_id, receiver_type),
                INDEX (assignment_id)
            )
        ''')
        
        # Create courses table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                code VARCHAR(20) NOT NULL,
                department VARCHAR(50) NOT NULL,
                credits INT NOT NULL,
                description TEXT,
                instructor VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Check if table is empty and add sample data if it is
        cursor.execute('SELECT COUNT(*) FROM students')
        count = cursor.fetchone()[0]
        
        if count == 0:
            cursor.execute('''
                INSERT INTO students (name, email, phone, department, grade, status)
                VALUES 
                ('John Doe', 'john@example.com', '123-456-7890', 'IT', 'A', 'active'),
                ('Jane Smith', 'jane@example.com', '234-567-8901', 'English', 'B+', 'active'),
                ('Bob Wilson', 'bob@example.com', '345-678-9012', 'IT', 'A-', 'pending')
            ''')
            
        # Check if courses table is empty and add sample data if it is
        cursor.execute('SELECT COUNT(*) FROM courses')
        course_count = cursor.fetchone()[0]
        
        if course_count == 0:
            cursor.execute('''
                INSERT INTO courses (name, code, department, credits, description, instructor)
                VALUES 
                ('Introduction to Programming', 'IT101', 'IT', 3, 'Fundamentals of programming concepts and problem-solving', 'Dr. Alan Turing'),
                ('Data Structures and Algorithms', 'IT201', 'IT', 4, 'Study of data structures, algorithms and their analysis', 'Dr. Ada Lovelace'),
                ('Database Management Systems', 'IT301', 'IT', 3, 'Design and implementation of database systems', 'Prof. Edgar Codd'),
                ('Web Development', 'IT302', 'IT', 4, 'Client-side and server-side web application development', 'Dr. Tim Berners-Lee'),
                ('Introduction to Hospitality', 'TM101', 'Tourism', 3, 'Overview of the hospitality industry', 'Prof. Maria Santos'),
                ('Tourism Management', 'TM201', 'Tourism', 4, 'Principles of tourism planning and management', 'Dr. James Wilson'),
                ('Event Planning', 'TM301', 'Tourism', 3, 'Organizing and managing events in the tourism industry', 'Prof. Emily Johnson'),
                ('English Literature', 'EN101', 'English', 3, 'Survey of English literature from different periods', 'Dr. William Shakespeare'),
                ('Academic Writing', 'EN201', 'English', 3, 'Developing academic writing skills', 'Prof. Jane Austen'),
                ('Linguistics', 'EN301', 'English', 4, 'Study of language structure and meaning', 'Dr. Noam Chomsky'),
                ('Soil Science', 'AG101', 'Agronomy', 4, 'Study of soil properties and management', 'Dr. George Washington Carver'),
                ('Crop Production', 'AG201', 'Agronomy', 3, 'Principles of crop cultivation and management', 'Prof. Norman Borlaug'),
                ('Sustainable Agriculture', 'AG301', 'Agronomy', 4, 'Environmentally sustainable farming practices', 'Dr. Wangari Maathai'),
                ('Introduction to Social Work', 'SW101', 'Social Work', 3, 'Fundamentals of social work practice', 'Prof. Jane Addams'),
                ('Community Development', 'SW201', 'Social Work', 4, 'Strategies for community-based development', 'Dr. Martin Luther King Jr.'),
                ('Counseling Techniques', 'SW301', 'Social Work', 3, 'Therapeutic approaches in social work practice', 'Prof. Carl Rogers')
            ''')
            
        conn.commit()
        cursor.close()
        conn.close()
        print('Database initialized successfully')
        
    except Error as e:
        print(f'Error initializing database: {e}')
        raise e

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except Error as e:
        error_message = str(e)
        if 'Can\'t connect to MySQL server' in error_message:
            raise Exception('Unable to connect to database server. Please check if MySQL is running.')
        elif 'Access denied' in error_message:
            raise Exception('Database access denied. Please check your credentials.')
        elif 'Unknown database' in error_message:
            raise Exception('Database does not exist. Please initialize the database.')
        else:
            raise Exception(f'Database connection error: {error_message}')

@app.route('/api/students', methods=['GET'])
def get_students():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM students')
        students = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(students)
    except Exception as e:
        return jsonify({
            'error': str(e),
            'type': 'database_error',
            'message': 'Failed to fetch students. Please check database connection.'
        }), 500

# Initialize database on startup
with app.app_context():
    init_db()

@app.route('/api/students', methods=['POST'])
def add_student():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''INSERT INTO students (name, email, phone, department, grade, status) 
                VALUES (%s, %s, %s, %s, %s, %s)'''
        values = (
            data['name'],
            data['email'],
            data['phone'],
            data.get('department', 'IT'),
            data['grade'],
            data.get('status', 'active')
        )
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Student added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students/<int:id>', methods=['PUT'])
def update_student(id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''UPDATE students 
                SET name = %s, email = %s, phone = %s, department = %s, grade = %s, status = %s 
                WHERE id = %s'''
        values = (
            data['name'],
            data['email'],
            data['phone'],
            data.get('department', 'IT'),
            data['grade'],
            data.get('status', 'active'),
            id
        )
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Student updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM students WHERE id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Student deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Calendar Events API
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM calendar_events ORDER BY event_date')
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(events)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events', methods=['POST'])
def add_event():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = 'INSERT INTO calendar_events (title, description, event_date) VALUES (%s, %s, %s)'
        values = (
            data['title'],
            data.get('description', ''),
            data['date']
        )
        cursor.execute(sql, values)
        conn.commit()
        
        # Get the ID of the newly inserted event
        event_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        return jsonify({'message': 'Event added successfully', 'id': event_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:id>', methods=['PUT'])
def update_event(id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = 'UPDATE calendar_events SET title = %s, description = %s, event_date = %s WHERE id = %s'
        values = (
            data['title'],
            data.get('description', ''),
            data['date'],
            id
        )
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Event updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events/<int:id>', methods=['DELETE'])
def delete_event(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM calendar_events WHERE id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Event deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Assignments API
@app.route('/api/assignments', methods=['GET'])
def get_assignments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM assignments ORDER BY due_date')
        assignments = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(assignments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/assignments', methods=['POST'])
def add_assignment():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''INSERT INTO assignments (title, description, due_date, teacher_id, department, status) 
                VALUES (%s, %s, %s, %s, %s, %s)'''
        values = (
            data['title'],
            data.get('description', ''),
            data['due_date'],
            data['teacher_id'],
            data['department'],
            data.get('status', 'active')
        )
        cursor.execute(sql, values)
        assignment_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Assignment added successfully', 'id': assignment_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/assignments/<int:id>', methods=['PUT'])
def update_assignment(id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''UPDATE assignments 
                SET title = %s, description = %s, due_date = %s, status = %s 
                WHERE id = %s'''
        values = (
            data['title'],
            data.get('description', ''),
            data['due_date'],
            data.get('status', 'active'),
            id
        )
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Assignment updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/assignments/<int:id>', methods=['DELETE'])
def delete_assignment(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM assignments WHERE id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Assignment deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Chat Messages API
@app.route('/api/chat/messages', methods=['GET'])
def get_chat_messages():
    try:
        sender_id = request.args.get('sender_id')
        sender_type = request.args.get('sender_type')
        receiver_id = request.args.get('receiver_id')
        receiver_type = request.args.get('receiver_type')
        assignment_id = request.args.get('assignment_id')
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = 'SELECT * FROM chat_messages WHERE 1=1'
        params = []
        
        if sender_id and sender_type:
            query += ' AND sender_id = %s AND sender_type = %s'
            params.extend([sender_id, sender_type])
            
        if receiver_id and receiver_type:
            query += ' AND receiver_id = %s AND receiver_type = %s'
            params.extend([receiver_id, receiver_type])
            
        if assignment_id:
            query += ' AND assignment_id = %s'
            params.append(assignment_id)
            
        query += ' ORDER BY created_at'
        
        cursor.execute(query, params)
        messages = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(messages)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/messages', methods=['POST'])
def add_chat_message():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''INSERT INTO chat_messages 
                (sender_id, sender_type, receiver_id, receiver_type, message, assignment_id) 
                VALUES (%s, %s, %s, %s, %s, %s)'''
        values = (
            data['sender_id'],
            data['sender_type'],
            data['receiver_id'],
            data['receiver_type'],
            data['message'],
            data.get('assignment_id')
        )
        cursor.execute(sql, values)
        message_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Message sent successfully', 'id': message_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/messages/mark-read', methods=['PUT'])
def mark_messages_as_read():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Mark messages as read based on receiver information
        sql = '''UPDATE chat_messages 
                SET is_read = TRUE 
                WHERE receiver_id = %s AND receiver_type = %s'''
        values = (
            data['receiver_id'],
            data['receiver_type']
        )
        
        # Add sender filter if provided
        if 'sender_id' in data and 'sender_type' in data:
            sql += ' AND sender_id = %s AND sender_type = %s'
            values += (data['sender_id'], data['sender_type'])
            
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Messages marked as read'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/unread-count', methods=['GET'])
def get_unread_count():
    try:
        receiver_id = request.args.get('receiver_id')
        receiver_type = request.args.get('receiver_type')
        
        if not receiver_id or not receiver_type:
            return jsonify({'error': 'Receiver ID and type are required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = '''
            SELECT COUNT(*) as unread_count 
            FROM chat_messages 
            WHERE receiver_id = %s AND receiver_type = %s AND is_read = FALSE
        '''
        
        cursor.execute(query, (receiver_id, receiver_type))
        result = cursor.fetchone()
        unread_count = result[0] if result else 0
        
        cursor.close()
        conn.close()
        return jsonify({'unread_count': unread_count})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Courses API
@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM courses ORDER BY department, code')
        courses = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(courses)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses', methods=['POST'])
def add_course():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''INSERT INTO courses 
                (name, code, department, credits, description, instructor) 
                VALUES (%s, %s, %s, %s, %s, %s)'''
        values = (
            data['name'],
            data['code'],
            data['department'],
            data['credits'],
            data['description'],
            data['instructor']
        )
        cursor.execute(sql, values)
        course_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Course added successfully', 'id': course_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses/<int:id>', methods=['PUT'])
def update_course(id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = '''UPDATE courses 
                SET name = %s, code = %s, department = %s, credits = %s, description = %s, instructor = %s 
                WHERE id = %s'''
        values = (
            data['name'],
            data['code'],
            data['department'],
            data['credits'],
            data['description'],
            data['instructor'],
            id
        )
        cursor.execute(sql, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Course updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/courses/<int:id>', methods=['DELETE'])
def delete_course(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM courses WHERE id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Course deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/students/upload', methods=['POST'])
def upload_students():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Please upload XLS, XLSX or CSV files only'}), 400
        
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Process the Excel file
        try:
            df = pd.read_excel(file_path) if file_path.endswith(('.xls', '.xlsx')) else pd.read_csv(file_path)
            
            # Normalize column names
            df.columns = [col.lower().strip() for col in df.columns]
            
            # Connect to database
            conn = get_db_connection()
            cursor = conn.cursor()
            
            success_count = 0
            error_count = 0
            errors = []
            
            # Process each row
            for _, row in df.iterrows():
                try:
                    # Extract data, handling potential missing columns
                    student = {}
                    
                    # Map common column names
                    name_cols = ['name', 'student name', 'fullname', 'full name']
                    email_cols = ['email', 'email address', 'mail']
                    phone_cols = ['phone', 'phone number', 'contact', 'mobile']
                    dept_cols = ['department', 'dept', 'faculty']
                    grade_cols = ['grade', 'marks', 'score']
                    status_cols = ['status', 'state']
                    
                    # Find matching columns
                    for col in df.columns:
                        if any(name_col in col for name_col in name_cols):
                            student['name'] = str(row[col])
                        elif any(email_col in col for email_col in email_cols):
                            student['email'] = str(row[col])
                        elif any(phone_col in col for phone_col in phone_cols):
                            student['phone'] = str(row[col])
                        elif any(dept_col in col for dept_col in dept_cols):
                            student['department'] = str(row[col])
                        elif any(grade_col in col for grade_col in grade_cols):
                            student['grade'] = str(row[col])
                        elif any(status_col in col for status_col in status_cols):
                            student['status'] = str(row[col])
                    
                    # Check required fields
                    if 'name' not in student or 'email' not in student or 'phone' not in student:
                        raise ValueError("Missing required fields (name, email, or phone)")
                    
                    # Set defaults for optional fields
                    if 'department' not in student:
                        student['department'] = 'IT'
                    if 'grade' not in student:
                        student['grade'] = 'N/A'
                    if 'status' not in student:
                        student['status'] = 'active'
                    
                    # Check if student already exists
                    cursor.execute('SELECT id FROM students WHERE email = %s', (student['email'],))
                    existing = cursor.fetchone()
                    
                    if existing:
                        # Update existing student
                        sql = '''UPDATE students 
                                SET name = %s, phone = %s, department = %s, grade = %s, status = %s 
                                WHERE email = %s'''
                        values = (
                            student['name'],
                            student['phone'],
                            student['department'],
                            student['grade'],
                            student['status'],
                            student['email']
                        )
                    else:
                        # Insert new student
                        sql = '''INSERT INTO students 
                                (name, email, phone, department, grade, status) 
                                VALUES (%s, %s, %s, %s, %s, %s)'''
                        values = (
                            student['name'],
                            student['email'],
                            student['phone'],
                            student['department'],
                            student['grade'],
                            student['status']
                        )
                    
                    cursor.execute(sql, values)
                    success_count += 1
                except Exception as e:
                    error_count += 1
                    errors.append(f"Row {_ + 2}: {str(e)}")
            
            conn.commit()
            cursor.close()
            conn.close()
            
            # Clean up - delete the uploaded file
            os.remove(file_path)
            
            return jsonify({
                'message': f'File processed successfully. Added/updated {success_count} students.',
                'success_count': success_count,
                'error_count': error_count,
                'errors': errors
            })
            
        except Exception as e:
            return jsonify({'error': f'Error processing file: {str(e)}'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug=True, port=5000)
