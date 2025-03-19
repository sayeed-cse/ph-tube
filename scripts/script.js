function showLoader(){
    document.getElementById('loader').classList.remove('hidden');
    document.getElementById('video-container').classList.add('hidden');
    
}
function hideLoader(){
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('video-container').classList.remove('hidden');
    
}

function removeActiveClass() {
    const activeBtns = document.getElementsByClassName('active');
    for (const activeBtn of activeBtns) {
        console.log(activeBtn);
        activeBtn.classList.remove('active');
    }
}

// loading
function loadCategories() {

    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(reponse => reponse.json())
        .then(data => displayCategories(data.categories))
}

function loadVideos(searchText='') {
    showLoader()

    const allBtn = document.getElementById('btn-all');
    removeActiveClass();
    allBtn.classList.add('active');
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
}

const loadVideosByCategories = (id) => {
    showLoader()
    // console.log(id)
    removeActiveClass()

    const clickedButton = document.getElementById(`btn-${id}`);
    clickedButton.classList.add('active')

    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayVideos(data.category));
}

const loadVideoDetails = (videoId) => {
    console.log(videoId)
    const url = ` https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayVideoDetails(data.video));
}

// displaying
function displayCategories(categories) {
    console.log(categories)
    const categoryContainer = document.getElementById('category-container');

    categories.forEach(cat => {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `
        <button id="btn-${cat.category_id}" onclick="loadVideosByCategories(${cat.category_id})" class="btn btn-sm hover:bg-red-700 hover:text-white">${cat.category}</button>
        `;
        categoryContainer.appendChild(categoryDiv)
    });
}

const displayVideos = (videos) => {
    
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = '';

    if (videos.length == 0) {
        videoContainer.innerHTML = `
        <div class="col-span-full flex flex-col justify-center items-center py-48">
            <img src="./assets/Icon.png" alt="">
            <h2 class="text-4xl font-bold">Oops!! Sorry, There is no content here</h2>
        </div>
        `;
        hideLoader()
        return;
    }

    videos.forEach((video) => {
        console.log(video)
        const videoCard = document.createElement('div');
        videoCard.classList = `card bg-base-100`;
        videoCard.innerHTML = `
        <figure class="relative">
                <img src="${video.thumbnail}" alt="Shoes" class="w-full h-52 object-cover rounded-lg"/>
                <span class="absolute bottom-4 right-4 text-white bg-black py-1 px-2 rounded-lg">3hrs 56 min ago</span>
        </figure>
        <div class="flex gap-4 py-5">
            <div class="avatar w-10 h-10">
                <img src="${video.authors[0].profile_picture}"  class="rounded-full"/>
            </div>
            <div>
                <h2 class="card-title font-bold">${video.title}</h2>
                <p class="flex gap-1 items-center">
                ${video.authors[0].profile_name}
                ${video.authors[0].verified ? `<img src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="" class="w-5">`: ``}
                
                </p>
                <p>${video.others.views} Views</p>
            </div>
            </div>
            <button onclick="loadVideoDetails('${video.video_id}')" class="btn mx-5">Show Details</button>
        `;
        videoContainer.appendChild(videoCard)
        hideLoader()
    });
  
}

const displayVideoDetails = (video) => {
    console.log(video)
    const modalId = document.getElementById('video-details');
    modalId.showModal();
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = `
        <div class="card bg-base-100 image-full shadow-sm">
        <figure>
            <img
            src="${video.thumbnail}"
            alt="" />
        </figure>
        <div class="card-body">
            <h2 class="text-4xl font-bold">${video.title}</h2>
            <p class='text-xl'>${video.description}</p>
            <p>Views: ${video.others.views}</p>
            <form method="dialog">
                <button class="btn">Close</button>
            </form>
        </div>
        </div>
   `;
}

document.getElementById('search-input').addEventListener('keyup',(e)=>{
    const input = e.target.value;
    loadVideos(input)
})

loadCategories();

