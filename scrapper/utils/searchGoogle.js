function SearchGoogle(keyword) {
    // construct the search URL using the keyword
    // const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(keyword);
    const searchUrl = `https://www.google.com/search?q=site%3Alinkedin.com+${keyword}+jobs&rlz=1C1VDKB_enPK1039PK1039&sxsrf=AJOqlzWQAnLFLTdPUjiZmJoDjdGfgNVsjQ%3A1678254285838&ei=zSAIZJDUMoPWkdUPwoeb8Ao&ved=0ahUKEwjQ7rK00Mv9AhUDa6QEHcLDBq4Q4dUDCBA&uact=5&oq=site%3Alinkedin.com+react+jobs&gs_lcp=Cgxnd3Mtd2l6LXNlcnAQA0oECEEYAVCmBliJMGCfMWgJcAB4AIABqAOIAdgakgEFMy01LjSYAQCgAQHAAQE&sclient=gws-wiz-serp`
    // send a GET request to the search URL using the fetch API
    fetch(searchUrl)
        .then(response => response.text())
        .then(data => {
            // create a DOM parser to parse the HTML data
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            // find the first search result link and navigate to it
            const firstLink = htmlDoc.querySelector('.yuRUbf a');
            console.log('first Link', htmlDoc, firstLink)
            if (firstLink) {
                  const url = firstLink.getAttribute('href').replace('/url?q=', '');
                  fetch(url)
                    .then(response => response.text())
                    .then(data => {
                      // retrieve the HTML code of the page
                      const linkedinDoc = parser.parseFromString(data, 'text/html');
                      console.log(linkedinDoc)
                    })
                    .catch(error => console.error(error));
            }
        })
        .catch(error => console.error(error));
}

export default SearchGoogle