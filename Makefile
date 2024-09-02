serve:
	bundle exec jekyll serve -t -l

serve-docker:
	docker run -p 4000:4000 -v $(shell pwd):/site bretfisher/jekyll-serve

build:
	bundle exec jekyll build
	cp _site/404/index.html _site/404.html

test: build
	bundle exec htmlproofer --check-html --internal-domain "signor.dev","www.signor.dev" ./_site --file_ignore "/_site/files/"
