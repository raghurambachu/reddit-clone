                
let activeTab = "hot"
let subReddit;
let activeTabData = "";

const aboutCardRoot_DOM = document.querySelector(".about-root");
const filterFlairRoot_DOM = document.querySelector(".filter-flair-root");
const subredditInfoSectionRoot_DOM = document.querySelector(".subreddit-info-section-root");
const redditContentCardRoot_DOM = document.querySelector(".reddit-content-cards-root");


const searchForm_DOM = document.querySelector(".search-form");
const inputSearch_DOM = document.querySelector(".input-search");
const backToTopBtn_DOM = document.querySelector(".back-to-top");

function getActiveTabData(subReddit=subReddit){
    fetch(`https://www.reddit.com/r/${subReddit}/${activeTab}.json`)
    .then(response => response.json())
    .then(subRedditData => {

        

        activeTabData = subRedditData;
        createFilterByFlairCard(activeTabData);
        createRedditContentCard(activeTabData);
        document.querySelector( `.reddit-content-chooser-btn[data-active=${activeTab}]`).classList.add("active-btn");


        fetch(`https://www.reddit.com/r/${subReddit}/about.json`)
        .then(response => response.json())
        .then(aboutCommunityData => {
            createAboutCommunityCard(aboutCommunityData);
            createSubRedditInfoSection(aboutCommunityData);
        })

    })
}

function createSubRedditInfoSection(aboutCommunityData){
    subredditInfoSectionRoot_DOM.innerHTML =   `
        <div class="just-flex info-holder">
            <p class="info-icon">
                <i class="fas fa-life-ring"></i>
            </p>
            <div class="title">
                    <h1>
                        ${aboutCommunityData.data.title}
                    </h1>
                    <p>
                        ${aboutCommunityData.data.url}
                    </p>
            </div>
            <button class="btn btn-join">JOIN</button>
        </div>
    `
}

function createFilterByFlairCard(activeTabData){
    const flairTags = activeTabData.data.children.reduce((flairTags,child) => !flairTags.includes(child.data.link_flair_text) ? flairTags.concat([child.data.link_flair_text]):flairTags,[]).filter(tag => tag)
    if(flairTags.length){
        filterFlairRoot_DOM.innerHTML = `
            <div class="filter-flair-card">
                <div class="filter-flair-top">
                    <p>Filter by flair</p>
                </div>
                <div class="filter-flair-bottom just-flex">
                   ${flairTags.map(tag => {
                       return  `
                            <button class="flair-btn">${tag}</button>
                       `
                   }).join("")}
                </div>
            </div>
        `
    }

}

function createRedditContentCard(activeTabData){
    redditContentCardRoot_DOM.innerHTML = `
        ${
            activeTabData.data.children.map((redditPost,index) => {
                let post = redditPost.data;
                return `
                    <article class="reddit-card just-flex">
                        <div class="reddit-card-left">
                            <p class="up">
                                <i class="fas fa-chevron-up"></i>
                            </p>
                            <p class="count">
                                ${post.score.toString().length > 3 ? (+post.score / 1000).toFixed(0) + "k" : post.score }
                            </p>
                            <p class="down">
                                <i class="fas fa-chevron-down"></i>
                            </p>
                        </div>
                        <div class="reddit-card-right">
                            ${index === 0 ? `
                                <div class="pinned">
                                    <i class="fas fa-thumbtack"></i> PINNED BY MODERATORS
                                </div>
                            ` : ""}
                            <div class="post-by">
                                <p>
                                    Posted by <span class="author">u/${post.author}author</span>
                                            <span class="author-flair">${post.author_flair_text ?  post.author_flair_text :  ""}</span>
                                            <span class="created-at">${Math.round(+(new Date()).getFullYear() - +new Date(post.created).getFullYear())} years ago</span>
                                            ${post.distinguished === "moderator" ? '<span class="moderator"><i class="fas fa-shield-alt"></i></span>' : ""}
                                            ${post.archived ? '<span class="archived"><i class="fas fa-archive"></i></span>' :  ""}
                                </p>
                            </div>
                            <div class="title-tag">
                                <div class="just-flex">
                                    ${post.link_flair_text ? `
                                        <p class="tag">
                                            ${post.link_flair_text}
                                        </p>
                                    ` : ""}
                                   <a target="_blank" href=${post.url}>
                                        <h2 class="card-title">
                                            ${post.title}
                                        </h2>
                                   </a>
                                </div>
                            </div>
                           ${post.selftext === "" ? "" : `
                                <div class="description-container">
                                    <p>${post.selftext.split(" ").slice(0,50).join(" ")}</p>
                                    <a class="read-more" href=${post.url}>
                                        <p>Read More</p>
                                    </a>
                                </div>
                           `}
                           ${post.thumbnail && post.thumbnail !== "self" && post.thumbnail !== "default"? `
                            <img class="thumbnail-image" src=${post.thumbnail} alt="img">
                            
                           ` : ""}

                            <div class="video-container">

                            </div>
                            <div class="card-bottom">
                                <span class="comments">
                                    <i class="fas fa-comment-alt"></i>
                                    ${post.permalink ? `
                                        <a href=${"https://www.reddit.com" + post.permalink }>
                                            ${post.num_comments} Comments
                                        </a>
                                    `: `
                                            ${post.num_comments} Comments
                                    `   
                                    }
                                </span>
                                <span class="share">
                                    <i class="fas fa-share"></i>
                                    Share
                                </span>
                                <span class="save">
                                    <i class="far fa-bookmark"></i>
                                    Save
                                </span>
                            </div>

                        </div>
                    </article>   
                `
            }).join("")
        }
    `
}


function createAboutCommunityCard(aboutCommunityData){
    
    aboutCardRoot_DOM.innerHTML =  `
            <div class="about-info-card">
                <div class="about-info-card-header">
                    About Community
                </div>
                <div class="about-info-card-content">
                    <p>Welcome to <span>${aboutCommunityData.data.display_name.toUpperCase()}</span></p>
                    <div class="activity-info just-flex">
                        <div class="subscribers col-1-2">
                            <div class="subscribers-count">
                                ${+aboutCommunityData.data.subscribers > 1000 ? Math.round(+aboutCommunityData.data.subscribers / 1000).toFixed(0) + "k" : aboutCommunityData.data.subscribers }
                            </div>
                            <div class="subscribers-title">
                                Members
                            </div>
                        </div>
                        <div class="online col-1-2">
                            <div class="online-count">
                                ${aboutCommunityData.data.active_user_count}
                            </div>
                            <div class="online-title">
                                Online
                            </div>
                        </div>
                    </div>
                    <div class="created-date just-flex">
                        <span class="created-icon">
                            <i class="fas fa-calendar-week"></i>
                        </span>
                        <p class="created-date-content">
                            Created date
                        </p>

                    </div>
                </div>
            </div> 
    `
}



searchForm_DOM.addEventListener("submit",function(e){
    subReddit = inputSearch_DOM.value;
    getActiveTabData(subReddit);
    inputSearch_DOM.value = "";
})


function handleClickOnRedditContentButton(e){
    let btnSelected = e.target.closest(".reddit-content-chooser-btn");
    if(!btnSelected || !subReddit) return;

    activeTab = btnSelected.dataset.active;
    [...document.querySelectorAll(".reddit-content-chooser-btn")].forEach(btn => btn.classList.contains("active-btn") ? btn.classList.remove("active-btn") : "")
    
    document.querySelector( `.reddit-content-chooser-btn[data-active=${activeTab}]`).classList.add("active-btn");
    // btnSelected.classList.add("active-btn");
    
    getActiveTabData(subReddit);
}




document.body.addEventListener("click",function(e){
    handleClickOnRedditContentButton(e);
})

window.addEventListener("scroll",function(e){
    if(window.scrollY > 280){
        backToTopBtn_DOM.style.display = "block";
    } else {
        backToTopBtn_DOM.style.display = "none";
    }
})


