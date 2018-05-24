(function(){
    'use strict';

    /*
      Create intra-page links.
      Source: https://gist.github.com/SimplGy/a229d25cdb19d7f21231

      Requires that your headings already have an `id` attribute set (because that's what jekyll does).
      For every heading in your page, this adds a little anchor link `#` that you can click to get a permalink to the heading.
      Ignores `h1`, because you should only have one per page.
      The text content of the tag is used to generate the link, so it will fail "gracefully-ish" if you have duplicate heading text.
    */

    var headingNodes = [], results, link, div,
        tags = ['h2', 'h3', 'h4', 'h5', 'h6'];

    tags.forEach(function(tag){
        results = document.getElementsByTagName(tag);
        Array.prototype.push.apply(headingNodes, results);
    });

    headingNodes.forEach(function(node) {
        div = document.createElement('div');
        div.className = 'header-anchor-container';

        link = document.createElement('a');
        link.className = 'header-anchor';
        link.textContent = '#';
        link.href = '#' + node.getAttribute('id');
        div.innerHTML += "[";
        div.appendChild(link);
        div.innerHTML += "]";
        node.appendChild(div);
    });

})();
