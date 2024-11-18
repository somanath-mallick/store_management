from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS
from datetime import datetime


app = Flask(__name__)
CORS(app)
DB_HOST = "localhost"
DB_NAME = "store"
DB_USER = "postgres"
DB_PASS = "postgres"

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )
    return conn

@app.route('/insert', methods=['POST'])
def insert_data():
    try:
        data = request.json
        items = data.get('items')
        amount = data.get('amount')

        if not items or not isinstance(amount, int):
            return jsonify({"error": "Invalid input data"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO store_master (items, amount)
            VALUES (%s, %s)
            """,
            (items, amount)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Data inserted successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    phone_no = data.get('phone_no')
    password = data.get('password')

    if not phone_no or not password:
        return jsonify({"error": "Both phone_no and password are required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = '''SELECT phone_no, password FROM public.users WHERE phone_no = %s AND password = %s'''
        cursor.execute(query, (phone_no, password))

        user = cursor.fetchone()

        if user:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/show', methods=['POST'])
def show():
    if request.is_json:
        data = request.json
        items = data.get('items')  
        start_date = data.get('start_date')  
        end_date = data.get('end_date')  

        if start_date:
            start_date = start_date[:10] 
        if end_date:
            end_date = end_date[:10]

        query = "SELECT * FROM public.store_master WHERE status=1"
        params = []

        if items and items.lower() != "items0":
            query += " AND items = %s"  
            params.append(items)

        if start_date:
            query += " AND start_date >= %s"
            params.append(start_date)

        if end_date:
            query += " AND end_date <= %s"
            params.append(end_date)

        print("Executing Query:", query)
        print("With Parameters:", params)

    else:
        query = "SELECT * FROM public.store_master"
        params = []

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()

        response = [{"items": row[1], "amount": row[2], "start_date": row[3], "end_date": row[4]} for row in rows]

        return jsonify(response)
    
    except Exception as e:
        print("Database error:", e) 
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500
    
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    app.run(debug=True)
