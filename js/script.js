const categoriesUL = document.getElementById('categories');
const videosContainer = document.getElementById('videos-container');


const sortButton = document.getElementById('btn-sort-by-view');
let videosData = null;

const loadCategories = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const data = await res.json();
    displayCategories(data.data);
}

const displayCategories = (items) => {
    for (const item of items) {
        console.log(`${item.category_id}-${item.category}`);
        const button = document.createElement('button');
        button.classList = `text-[#252525] bg-[#25252533] text-base font-medium rounded-md py-2 px-8`;
        button.innerText = item.category;
        button.addEventListener("click", () => loadVideosByCategory(item.category_id));
        categoriesUL.appendChild(button);
    }
}

const loadVideosByCategory = async (categoryId = 1000) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`);
    const data = await res.json();
    videosData = data;
    console.log(data);
    displayVideos(data.data);
}

const displayVideos = (videos, isSort = false) => {
    videosContainer.innerHTML = '';
    if (videos.length <= 0) {
        videosContainer.classList = '';
        videosContainer.innerHTML = `<div class="flex flex-col items-center justify-center mt-4">
                                        <img  src="img/Icon.png" alt="">
                                        <h2 class="text-3xl font-bold leading-[44px] text-center">Oops!! Sorry, There is no <br> content here</h2>
                                    </div>`;
    } else {
        videosContainer.classList = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10`;
        if (isSort === true) {
            videos = videos.sort((a, b) => {
                return stringToNumber(b.others.views) - stringToNumber(a.others.views);
            });
            console.log(videos);
        }
        for (const video of videos) {
            stringToNumber(video.others.views);
            const div = document.createElement("div");
            div.innerHTML = `<figure class="relative rounded-lg bg-slate-500">
                            <img class="w-full lg:w-[312px] md:h-[200px]  object-cover rounded-lg" src=${video.thumbnail} alt="">
                            <div class="absolute bottom-3 right-3 bg-[#171717] rounded py-2 px-[5px] ${video.others.posted_date === '' ? "hidden" : ''}">
                                <p class="text-[10px] text-white">${secondsToHms(video.others.posted_date)} ago</p>
                            </div>
                        </figure>
                        <div class="flex gap-3 mt-4">
                            <figure class="">
                                <img class="w-10 h-10 rounded-full" src="${video.authors[0].profile_picture}" alt="">
                            </figure>
                            <div>
                                <h2 class="text-[#171717] text-base font-bold leading-[26px]">${video.title}</h2>
                                <div class="flex gap-2 my-2">
                                    <p class="text-[14px] text-[#171717b3]">${video.authors[0].profile_name}</p>
                                    <img id="verifyImg" class="w-5 h-5 ${video.authors[0].verified === true ? "hidden" : ""} " src="img/verified.png" alt="">
                                </div>
                                <p class="text-[14px] text-[#171717b3]">${video.others.views} views</p>
                            </div>
                        </div>`;
            videosContainer.appendChild(div);
        }
    }

}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hr " : " hrs ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min " : " min ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    //return hDisplay + mDisplay + sDisplay; 
    return hDisplay + mDisplay;
}

function stringToNumber(viewsString) {
    const text = viewsString.substring(0, (viewsString.length - 1))
    const num = parseFloat(text);
    console.log(`String is : ${text} and Number is:  ${num} Type Is : ${typeof num}`);
    return num;
}


function sortByViewData() {
    displayVideos(videosData.data, true);
}

// CALL FUNCTION
loadCategories();
loadVideosByCategory();













