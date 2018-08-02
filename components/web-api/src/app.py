from flask import Flask, jsonify, request
import json

import fasttext as ft

import MeCab


from gensim.models import word2vec


classifier = ft.load_model('/models/mynavi.bin')

wiki_model = word2vec.Word2Vec.load("/models/wiki.model")


m = MeCab.Tagger('-Owakati')

def wakati(bussiness):
    return m.parse(bussiness).strip()

def format_estimate(estimate):
    return {
      'bussiness': estimate[0][9:],
      'probability': estimate[1],
    }


def format_calc_result(estimate):
    return {
      'word': estimate[0],
      'similarity': estimate[1],
    }

app = Flask(__name__)

@app.route('/predict', methods=['GET'])
def hello():
    q = request.args.get('q')
    estimates = classifier.predict_proba([wakati(q)], k=3)[0]

    formatedEstimates = list(map(format_estimate, estimates))
    return jsonify({
      'estimates': formatedEstimates,
    })

@app.route('/calc', methods=['POST'])
def calc():
    req = request.json
    negative = req['negative']
    positive = req['positive']

    results = wiki_model.wv.most_similar(positive = positive, negative = negative)

    formatedResults = list(map(format_calc_result, results))

    return jsonify({
      'results': formatedResults,
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
