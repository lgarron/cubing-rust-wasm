.PHONY: build
build:
	wasm-pack build --target web

.PHONY: serve-build
serve-build: build
	open http://localhost:8000/src/dev/; caddy file-server --listen :8000 --browse
