from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

DATABASE = 'eligibility.db'

def init_db():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            age INTEGER,
            income REAL,
            job_type TEXT,
            credit_score INTEGER
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/check-eligibility', methods=['POST'])
def check_eligibility():
    data = request.get_json()
    age = data.get('age')
    income = data.get('income')
    job_type = data.get('jobType')
    credit_score = data.get('creditScore')

    # Store user data in DB
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute(
        'INSERT INTO applications (age, income, job_type, credit_score) VALUES (?, ?, ?, ?)',
        (age, income, job_type, credit_score)
    )
    conn.commit()
    conn.close()


@app.route('/loan-types', methods=['GET'])
def get_loan_types():
    loan_types = [
        {"type": "Home Loan", "interest_rate": 6.5, "max_amount": 5000000},
        {"type": "Car Loan", "interest_rate": 7.2, "max_amount": 1000000},
        {"type": "Education Loan", "interest_rate": 5.9, "max_amount": 2000000},
        {"type": "Personal Loan", "interest_rate": 11.0, "max_amount": 1500000}
    ]
    return jsonify(loan_types)

    # Eligibility logic
    if age < 18:
        return jsonify(message="⚠️ You must be at least 18 years old.")
    if income < 5000:
        return jsonify(message="⚠️ Income appears too low, improve your financials.")
    if credit_score < 600:
        return jsonify(message="⚠️ Low credit score, consider improving it.")

    return jsonify(message="✅ You are eligible for a loan!")

# Route to receive "Get Started" additional credentials data
@app.route('/save-get-started', methods=['POST'])
def save_get_started():
    data = request.get_json()
    monthly_income_estimate = data.get('monthlyIncomeEstimate')
    repayment_capacity = data.get('repaymentCapacity')
    self_employed_years = data.get('selfEmployedYears')
    if monthly_income_estimate is None or repayment_capacity is None or self_employed_years is None:
        return jsonify({"error": "Missing required fields"}), 400
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''
        INSERT INTO user_credentials (monthly_income_estimate, repayment_capacity, self_employed_years)
        VALUES (?, ?, ?)
    ''', (monthly_income_estimate, repayment_capacity, self_employed_years))
    conn.commit()
    conn.close()
    return jsonify({"message": "Get Started data saved successfully."}), 200
# Your existing eligibility logic route here
@app.route('/check-eligibility', methods=['POST'])
def check_eligibility():
    # existing eligibility logic...
    pass

@app.route('/check-eligibility', methods=['POST'])
def check_eligibility():
    data = request.get_json()
    monthly_income = data.get('monthlyIncome')
    repayment_capacity = data.get('repaymentCapacity')
    self_employed_years = data.get('selfEmployedYears')
    if monthly_income is None or repayment_capacity is None or self_employed_years is None:
        return jsonify({"error": "Missing required fields"}), 400
    # Calculate Debt-to-Income Ratio
    dti = (repayment_capacity / monthly_income) * 100
    # Determine eligibility
    if dti < 40 and self_employed_years >= 2:
        eligibility_status = "Eligible for loan"
    else:
        eligibility_status = "Not eligible for loan"
    return jsonify({
        "eligibility_status": eligibility_status,
        "dti": dti,
        "self_employed_years": self_employed_years
    }), 200

@app.route('/check-eligibility', methods=['POST'])
def check_eligibility():
    data = request.get_json()

    # Extract all fields, from Get Started and Eligibility form
    age = data.get('age')
    job_type = data.get('jobType')
    credit_score = data.get('creditScore')

    monthly_income = data.get('monthlyIncomeEstimate')
    repayment_capacity = data.get('repaymentCapacity')
    self_employed_years = data.get('selfEmployedYears')

    # Validate essential fields presence
    missing_fields = []
    for field_name, val in [('age', age), ('jobType', job_type), ('creditScore', credit_score),
                            ('monthlyIncomeEstimate', monthly_income), ('repaymentCapacity', repayment_capacity), ('selfEmployedYears', self_employed_years)]:
        if val is None:
            missing_fields.append(field_name)
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Basic checks
    if age < 18:
        return jsonify(message="⚠️ You must be at least 18 years old."), 200
    if monthly_income < 10000:
        return jsonify(message="⚠️ Income too low for loan eligibility."), 200
    if self_employed_years < 2:
        return jsonify(message="⚠️ Minimum 2 years of self-employment required."), 200

    # Calculate Debt-to-Income (DTI) ratio
    dti = (repayment_capacity / monthly_income) * 100
    if dti > 40:
        return jsonify(message=f"⚠️ High debt to income ratio ({dti:.1f}%). Consider lowering expenses or increasing income."), 200

    # Credit score evaluation
    if credit_score < 600:
        return jsonify(message="⚠️ Credit score too low, consider improving your credit history."), 200
    elif credit_score < 700:
        score_msg = "Fair credit score, may qualify for limited loans."
    else:
        score_msg = "Good credit score."

    # Job type-specific nuances: Example - gig workers may have different thresholds
    if job_type == 'gig' and self_employed_years < 3:
        return jsonify(message="⚠️ Gig workers should have at least 3 years of stable income."), 200

    # Final eligibility
    return jsonify(message=f"✅ Eligible for loan. {score_msg} Debt-to-Income ratio: {dti:.1f}%. Self-employment years: {self_employed_years}."), 200




@app.route('/estimate-income', methods=['POST'])
def estimate_income():
    data = request.get_json()

    upi_txn_count = data.get('upiTransactions', 0)
    data_usage_gb = data.get('dataUsageGB', 0)
    location = data.get('location', 'urban').lower()

    # Simple scoring logic (just for simulation)
    upi_score = min(upi_txn_count, 50) * 100
    data_score = min(data_usage_gb, 100) * 50

    # Location multiplier
    location_multiplier = 1.2 if location == 'urban' else 1.0

    # Estimated income calculation
    estimated_income = (upi_score + data_score) * location_multiplier

    return jsonify({
        "estimatedIncome": round(estimated_income, 2),
        "message": f"Estimated monthly income based on behavior is ₹{round(estimated_income, 2)}"
    })



if __name__ == '__main__':
    app.run(debug=True)

    
