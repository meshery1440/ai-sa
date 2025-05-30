from flask import Flask, render_template
import os

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dev')
def dev():
    return render_template('index_new.html')

@app.route('/report')
def report():
    return render_template('ai_report.html')

@app.route('/future_ai')
def future_ai():
    return render_template('future_ai.html')

@app.route('/dev/deep-learning.html')
def deep_learning():
    return app.send_static_file('dev/deep-learning.html')

@app.route('/dev/generative-ai.html')
def generative_ai():
    return app.send_static_file('dev/generative-ai.html')

@app.route('/dev/neural-networks.html')
def neural_networks():
    return app.send_static_file('dev/neural-networks.html')

@app.route('/dev/vr-ar.html')
def vr_ar():
    return app.send_static_file('dev/vr-ar.html')

@app.route('/dev/3d-modeling.html')
def three_d_modeling():
    return app.send_static_file('dev/3d-modeling.html')

if __name__ == '__main__':
    # هذا الجزء مخصص للتشغيل المباشر لـ app.py (اختياري)
    # الخادم الرئيسي هو simple_server.py
    port = int(os.environ.get('PORT', 5001)) # استخدام منفذ مختلف إذا تم تشغيله مباشرة
    app.run(debug=True, host='0.0.0.0', port=port)
