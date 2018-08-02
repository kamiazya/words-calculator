FROM python:3.6

RUN apt-get update && \
    apt-get install -y mecab libmecab-dev mecab-ipadic mecab-ipadic-utf8 python-numpy python-scipy

ADD requirements.txt /requirements.txt

RUN pip install Cython h5py

RUN pip install -r requirements.txt

ADD src/ /src/
CMD ["python", "src/app.py"]

ADD models/ /models/
