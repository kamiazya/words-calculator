from flask import Flask, jsonify, request
import json

import fasttext as ft

import MeCab


classifier = ft.load_model('/models/mynavi.bin')


m = MeCab.Tagger('-Owakati')

def wakati(bussiness):
    return m.parse(bussiness).strip()

def format_estimate(estimate):
    return {
      'bussiness': estimate[0][9:],
      'probability': estimate[1],
    }

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello():
    q = request.args.get('q')
    estimates = classifier.predict_proba([wakati(q)], k=3)[0]

    formatedEstimates = list(map(format_estimate, estimates))
    return jsonify({
      'estimates': formatedEstimates,
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
