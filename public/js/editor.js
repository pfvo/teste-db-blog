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

const test2 = () => {
    if (bp.value.length >= 5 && bpt.value.length >= 1) {
        publishBtn.style.backgroundColor = 'black'
    } else {
        publishBtn.style.backgroundColor = "grey"
    }
    console.log('total letras: ',bp.value.length)
    console.log('total palavras: ',bp.value.split(" ").length)
}

const editorUploadImage = (uploadFile) => {
    console.log(location.origin)
    
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
            console.log(bannerPath)
            return banner.style.backgroundImage = `url("${url}")`
            })
        } else if (uploadFile === imageUpload) {
            formdata.append('image', uploadFile.files[0]);
            fetch('/upload', {
                method: "post",
                body: formdata
            })
            .then(resp => resp.json())
            .then(url => uploadedImage(url.imagePath, url.imageName))

        }
    }
}
const uploadedImage = (imgPath, alt) => {
    console.log(imgPath)
    console.log(alt)
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