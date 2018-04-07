serve:
	bundle exec jekyll serve -t -l

build:
	bundle exec jekyll build

test: build
	bundle exec htmlproofer --check-html --internal-domain "bytedude.com","www.bytedude.com" ./_site
