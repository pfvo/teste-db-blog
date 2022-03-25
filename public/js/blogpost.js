const banner = document.querySelector('.banner')
const bp = document.querySelector('.blog-post-content')
const bpt = document.querySelector('.blog-post-tittle')
const bpd = document.querySelector('.blog-post-date')
const nav = document.querySelector('nav')

let blogId = decodeURI(location.pathname.split('/').pop())
const fetchElements = () => {
    console.log("yay")
    fetch('/blogid', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            id: blogId
        })
    })
    .then(data => data.json())
    .then(post => {
        console.log(post.content)
        const mountPostImages= post.content.split('\n').filter(item => item.length)
        const mapped = mountPostImages.map(string => {
            if (string.includes('![') && string.includes('](')) {
               let s1= string.replace('![', '<div class="content-img-container"><img class="content-image" alt=\"')
               let s2= s1.replace('](', '\" src=\"')
               let s3 = s2.replace(')', '\"/></div>')
               return s3
            } else {
                return `<p>${string}</p>`;
            }
        })
        bpt.textContent = post.tittle
        bpd.textContent = post.created
        bp.innerHTML = mapped.join(' ')
        banner.style.backgroundImage = `url(${post.banner_img})`
    })
}

document.querySelector("body").addEventListener('load', fetchElements())