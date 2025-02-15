document.addEventListener('DOMContentLoaded', async function() {
    const logOut = document.querySelector("#logout");
    const home = document.querySelector("#home");
    let userId = null;
    const logo = this.document.querySelector("h1");
    const name = document.querySelector("#name");
    const signOff = document.querySelector("#signoff");

    home.addEventListener('click', function() {
        window.location.href = '/posts/write';
    });

    logo.addEventListener('click', function() {
        window.location.href = "/";
    });

    async function checkLogin() {
        try {
            const response = await fetch("/signin");
            const data = await response.json();
            if (data.status === "success") {
                userId = data.id;
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error(error);
            window.location.href = '/login';
        }
    }

    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        const titleElement = document.createElement('h2');
        titleElement.textContent = post.title;
        titleElement.classList.add("text-wrapper-6");

        const authorElement = document.createElement('p');
        authorElement.classList.add("text-wrapper-7");
        authorElement.innerHTML = `<svg class="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_2013_976)">
                          <rect width="24" height="24" rx="12" fill="#CBCCCE"/>
                          <path d="M12.5 15C15.1244 15 17.25 12.8744 17.25 10.25C17.25 7.62562 15.1244 5.5 12.5 5.5C9.87563 5.5 7.75 7.62562 7.75 10.25C7.75 12.8744 9.87563 15 12.5 15ZM12.5 17.375C9.32937 17.375 3 18.9662 3 22.125V23.3125C3 23.9656 3.53438 24.5 4.1875 24.5H20.8125C21.4656 24.5 22 23.9656 22 23.3125V22.125C22 18.9662 15.6706 17.375 12.5 17.375Z" fill="white"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_2013_976">
                            <rect width="24" height="24" rx="12" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>${post.author}`;
        name.innerText = post.author;

        const contentElement = document.createElement('p');
        contentElement.textContent = post.content;
        contentElement.classList.add("p");

        const counting = document.createElement('div');
        counting.textContent = `${post.counting}회 조회`;
        counting.classList.add("text-wrapper-8");

        const like = document.createElement('div');
        like.classList.add("text-wrapper-8");
        like.innerHTML = `
        <svg class="heart-streamline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <g clip-path="url(#clip0_2013_1031)">
              <path d="M8.00496 14.152L1.74854 8.48496C-1.6517 5.08472 3.34664 -1.44373 8.00496 3.83796C12.6632 -1.44373 17.639 5.10739 14.2614 8.48496L8.00496 14.152Z" stroke="#B4B5B7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_2013_1031">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
        </svg>
        ${post.likes}
    `;

        postDiv.appendChild(titleElement);
        postDiv.appendChild(authorElement);
        postDiv.appendChild(contentElement);
        postDiv.appendChild(counting);
        postDiv.appendChild(like);

        const postsContainer = document.querySelector('.frame-7');
        postsContainer.appendChild(postDiv);
    }

    async function loadPosts() {
        try {
            const response = await fetch('/posts');
            const data = await response.json();
            data.forEach(post => {
                if (post.author === userId) {
                    createPostElement(post);
                }
            });
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    await checkLogin();
    if (userId) {
        loadPosts();
    }

    logOut.addEventListener('click', function(event) {
        event.preventDefault();

        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ logout: true })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Logout failed.');
            }
        })
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                window.location.href = '/login';
            } else {
                throw new Error(data.message);
            }
        })
        .catch(err => {
            console.error(err.message);
            alert('로그아웃 중 오류가 발생했습니다.');
        });
    });

    signOff.addEventListener('click', function(event) {
        event.preventDefault();

        fetch(`/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('회원 탈퇴 실패');
            }
        })
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                window.location.href = `/login/${userId}`;
            } else {
                throw new Error(data.message);
            }
        })
        .catch(err => {
            console.error(err.message);
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        });
    });
});
