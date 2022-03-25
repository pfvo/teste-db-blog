const res = require("express/lib/response")

const btn = document.querySelector('.btntest')
const banner = document.querySelector('.banner')
const bannerUpload = document.querySelector('#banner-upload')
const bannerUploadBtn = document.querySelector('.banner-upload-btn')
const bp = document.querySelector('.blog-post-content')
const bpt = document.querySelector('.blog-post-tittle')
const publishBtn = document.querySelector('.publish-btn');
const imageUpload = document.querySelector('#image-upload')
const imageUploadBtn = document.querySelector('.image-upload-btn')
let bannerPath;

const editorUploadImage = (uploadFile) => {  
    const [file] = uploadFile.files;
    const formdata = new FormData();
    if (file && file.type.includes('image')) {
        if(uploadFile === bannerUpload) {
            formdata.append('bannerImage', uploadFile.files[0]);
            fetch('/upload', {
                method: "post",
                body: formdata
            })
            .then(data => data.json())
            .then(url => {
            bannerPath = location.origin + url;
            return banner.style.backgroundImage = `url("${url}")`
            }).catch(e => console.log(e, "my error"))
        } else if (uploadFile === imageUpload) {
            formdata.append('image', uploadFile.files[0]);
            fetch('/upload', {
                method: "post",
                body: formdata
            })
            .then(resp => resp.json())
            .then(url => uploadedImage(url.imagePath, url.imageName))
            .catch(e => console.log(e, "my error"))
        }
    }
}
const uploadedImage = (imgPath, alt) => {
    let currentPosition = bp.selectionStart;
    let textToInsert = `\r![${alt}](${imgPath})\r`; 
    bp.value = bp.value.slice(0, currentPosition) + textToInsert + bp.value.slice(currentPosition);
}

const publishPost = () => {
    if(!bannerPath || bpt.value.length < 1 || bp.value.length < 1) {
        return console.log('sorry, you need to fill everithing')
    }
    fetch('/pub', {
        method: "post",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            banner: bannerPath,
            tittle: bpt.value,
            content: bp.value
        })
    })
    .then(post => post.json())
    .then(data => location.href = `/${data[0].id}`)
    .catch(e => console.log("Front end error", e))

}


bp.addEventListener('input', test2)
bpt.addEventListener('input', test2)


publishBtn.addEventListener('click', publishPost);
imageUpload.addEventListener('change', () => editorUploadImage(imageUpload))
bannerUpload.addEventListener('change', () => editorUploadImage(bannerUpload))