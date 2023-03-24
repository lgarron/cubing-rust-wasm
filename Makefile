.PHONY: build
build:
	wasm-pack build --target web
	cp -R ./src/dev/ pkg/
	cat "./pkg/package.json" | jq ".type = \"module\"" > ./pkg/package.json.tmp
	mv ./pkg/package.json.tmp ./pkg/package.json

.PHONY: serve-build
serve-build: build
	open http://localhost:8000/; caddy file-server --listen :8000 --browse --root ./pkg

.PHONY: clean
clean:
	rm -rf pkg


DEPLOY_SOURCE_PATH = ./pkg/
DEPLOY_SITE_PATH   = experiments.cubing.net/rust/wasm/
DEPLOY_SFTP_PATH   = "cubing_deploy@towns.dreamhost.com:~/${DEPLOY_SITE_PATH}"

.PHONY: deploy
deploy: build
	rsync -avz \
		--exclude .DS_Store \
		--exclude .git \
		${DEPLOY_SOURCE_PATH} \
		${DEPLOY_SFTP_PATH}
	echo "\nDone deploying. Go to https://${DEPLOY_SITE_PATH}\n"
