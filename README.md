# 🎓 Course Comparison Web App
Many students struggle to find the best courses and institutes in Pune. To simplify this, I built Course Comparison using Django, HTML, CSS, and JavaScript. It allows students to easily sort and compare institutes based on fees, placement rates, and ratings, helping them find the best option within their budget.

---
## 🌐 Live Demo
🔗 [View Live Application](https://your-live-demo-link.com)  
*(Replace with actual deployment URL if available)*

---

## 📸 Screenshots

### 🏠 Home Page  
![Home Page](Screenshots/Home.png)
![Home Page](Screenshots/Home2.png)

### 🎓 Show Courses Page
![Show Courses](Screenshots/Show.png)

### 📊 Comparison Page  
![Compare Courses](Screenshots/Compare.png)

### 🗣️ Reviews Page  
![Reviews](Screenshots/Reviews.png)

### 📝 Submit Review Form  (Login Required)
![Review Form](Screenshots/ReviewForm.png)

### ✉️ Contact Form  
![Contact Form](Screenshots/Contact.png)

### ❓ Help / FAQ Page  
![Help](Screenshots/Help.png)

### 🔐 Login Page 
![Login Page](Screenshots/Login.png)

### 🏠 🧑‍💻 Register Page  
![Register Page](Screenshots/Register.png)

### 🎓 Courses Administration Panel  
![Courses Administration](Screenshots/Courses_Administration.png)

### 🧾 Review Administration Panel  
![Review Administration](Screenshots/Review_Administration.png)

### 📬 Enquiry Administration Panel  
![Enquiry Administration](Screenshots/Enquiry_Administration.png)


---

🔍 Features
- 🔎 Course Search & Filter – Easily search and filter courses by name, fees, ratings, and more.
- 📊 Compare Multiple Courses – Side-by-side comparison to help students choose the best institute.
- ⭐ View Ratings & Reviews – See honest feedback from other users to make informed decisions.
- 📝 Register and Login to Submit Reviews – Only logged-in users can submit reviews, ensuring accountability.
- ✉️ Contact Form for Inquiries – Reach out directly for any questions or guidance.
- 🔐 Secure Login, Logout, and Signup System – Built-in authentication with session management.
- 🛡️ Admin Dashboard (Django) – Full admin control for managing courses, reviews, and inquiries.



---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap
- **Backend:** Python, Django
- **Database:** MySQL
- **Others:** Django Admin, Forms, Templates, Static Files

---

## 📁 Project Structure

Course-Comparison/
├── comparison/
│ ├── migrations/
│ ├── templates/comparison/
│ ├── static/
│ ├── admin.py
│ ├── models.py
│ ├── views.py
│ ├── urls.py
│ └── forms.py
├── CourseComparison/
│ ├── settings.py
│ ├── urls.py
│ └── wsgi.py
├── manage.py
├── db.sqlite3
└── requirements.txt

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Python 3.7+
- pip (Python package installer)

### 💻 Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/khatri-raj/Course-Comparison.git
cd Course-Comparison

# 2. Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py makemigrations
python manage.py migrate

# 5. Run the development server
python manage.py runserver
Then go to: http://127.0.0.1:8000

🔐 Admin Access
# Create a superuser
python manage.py createsuperuser
Log in at: http://127.0.0.1:8000/admin

📦 Sample requirements.txt
Django>=4.0,<5.0
pytz
sqlparse
asgiref

👨‍💻 Built 100% by me – from backend models to frontend UI and deployment setup.

📫 Contact
Name: Raj Khatri
Email: rajkhatri8060@gmail.com
GitHub: @khatri-raj
