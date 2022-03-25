const body = document.querySelector('body')

const cardImg1=document.querySelector('.card-img-1')
const cardTittle1=document.querySelector('.card-tittle-1')

const cardImg2=document.querySelector('.card-img-2')
const cardTittle2=document.querySelector('.card-tittle-2')

const cardImg3=document.querySelector('.card-img-3')
const cardTittle3=document.querySelector('.card-tittle-3')
const card1=document.querySelector('.card1')
const card2=document.querySelector('.card2')
const card3=document.querySelector('.card3')

const getLatest = () => {
    fetch('/latestPosts', {
        method: "post",
        headers: {'Content-Type': 'application/json'},
    })
    .then(data => data.json())
    .then(postsArray => {
        return postsArray.reverse()
    })
    . then(posts => {
        card1.id = posts[0].id;
        cardImg1.src = posts[0].banner_img;
        cardTittle1.textContent = posts[0].tittle;
        card2.id = posts[1].id;
        cardImg2.src = posts[1].banner_img;
        cardTittle2.textContent = posts[1].tittle;
        card3.id = posts[2].id;
        cardImg3.src = posts[2].banner_img;
        cardTittle3.textContent = posts[2].tittle;
        
    })
    .catch(err => res.status(400).json('unable to fetch the lastest posts'))
}

const getPost = (card) => {
    location.href = `/${card.id}`;
}


body.addEventListener('load', getLatest())
card1.addEventListener('click', () => getPost(card1))
card2.addEventListener('click', () => getPost(card2))
card3.addEventListener('click', () => getPost(card3))