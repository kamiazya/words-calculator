.PHONY: all dev clean switch-context

CONTEXT := docker-for-desktop

all: dev clean

switch-context:
	# コンテキストの切り替え
	kubectl config use-context $(CONTEXT) > /dev/null

# ############
# 開発
# ############

# 開発を開始する
dev: switch-context
	skaffold dev --cleanup=false --toot

clean: switch-context
	kubectl delete -f ./k8s/


# ############
# 初期化処理関連
# ############

.PHONY: init init-https-secret

init:
	# Helm のインストール
	# https://qiita.com/quickguard/items/48ea2b69395afde3517b
	curl -s https://get.helm.sh | bash
	helm update

	# Ingress コントローラーのインストール
	bash ./tools/bootstrap/run-nginx-ingress.sh

	$(MAKE) init-https-secret

# localhost 用の SSL証明書を作成する
# https://github.com/FiloSottile/mkcert/blob/master/README.md
init-https-secret:
	brew install mkcert
	brew install nss # if you use Firefox

	mkcert -install
	mkcert category-classifier.localhost '*.category-classifier.localhost' localhost 127.0.0.1 ::1
	kubectl create secret generic category-classifier-https-secret --from-file=tls.key=./category-classifier.localhost+4-key.pem --from-file=tls.crt=./category-classifier.localhost+4.pem
	rm ./category-classifier.localhost+4.pem ./category-classifier.localhost+4-key.pem
