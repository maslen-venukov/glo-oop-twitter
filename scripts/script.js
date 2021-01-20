'use strict';

class FetchData {
  onGetData = async url => {
    const res = await fetch(url);
    return res.json();
  }

  onGetPosts = () => this.onGetData('db/dataBase.json');
}

class Twitter {
  constructor({ listElem }) {
    this.tweets = new Posts();
    this.elems = {
      listElem: document.querySelector(listElem)
    }

    const fetchData = new FetchData();
    fetchData.onGetPosts().then(data => {
      data.forEach(el => this.tweets.onAddPost(el));
      this.onShowAllPosts();
    });
  }

  onRenderPosts(tweets) {
    this.elems.listElem.textContent = '';
    const listElemHtml = tweets ? tweets.reduce((sum, tweet) => `
      ${sum}
      <li data-id=${tweet.id}>
        <article class="tweet">
          <div class="row">
            <img class="avatar" src="images/${tweet.nickname}.jpg" alt="Аватар пользователя ${tweet.username}">
            <div class="tweet__wrapper">
              <header class="tweet__header">
                <h3 class="tweet-author">${tweet.username}
                  <span class="tweet-author__add tweet-author__nickname">@${tweet.nickname}</span>
                  <time class="tweet-author__add tweet__date">${tweet.onGetDate()}</time>
                </h3>
                <button class="tweet__delete-button chest-icon"></button>
              </header>
              <div class="tweet-post">
                <p class="tweet-post__text">${tweet.text}</p>
                  ${tweet.img
                    ? `<figure class="tweet-post__image"><img src="${tweet.img}"></figure>`
                    : ''}
              </div>
            </div>
          </div>
          <footer>
            <button class="tweet__like">${tweet.likes}</button>
          </footer>
        </article>
      </li>
    `, '') : 'Твитов нет';
    this.elems.listElem.insertAdjacentHTML('afterbegin', listElemHtml);
  }

  onShowUserPosts() {

  }

  onShowLikedPosts() {

  }

  onShowAllPosts() {
    this.onRenderPosts(this.tweets.posts);
    console.log(this.tweets.posts);
  }

  onOpenModal() {

  }
}

class Posts {
  constructor({ posts = null } = {}) {
    this.posts = posts;
  }

  onAddPost(tweet) {
    const post = new Post(tweet);
    this.posts ? this.posts = [...this.posts, post] : this.posts = [post];
  }

  onDeletePost(id) {
    this.posts = this.posts.filter(post => post.id !== id);
  }

  onLikePost(id) {
    this.posts = this.posts.map(post => post.id === id ? { ...post, isLiked: true } : post);
  }
}

class Post {
  constructor({ id, username, nickname, date, text, img, likes }) {
    this.id = id || this.onGenerateId();
    this.username = username;
    this.nickname = nickname;
    this.date = date ? new Date(date) : new Date();
    this.text = text;
    this.img = img;
    this.likes = likes || 0;
    this.isLiked = false;
  }

  onChangeLike() {
    this.isLiked = !this.isLiked;
    this.isLiked ? this.likes++ : this.likes--;
  }

  onGenerateId() {
    return Math.random().toString().substring(2) + (+new Date).toString(32);
  }

  onGetDate() {
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'ноября', 'декабря'];
    return `${this.date.getDate()} ${months[this.date.getMonth() - 1]}`;
  }
}

const twitter = new Twitter({
  listElem: '.tweet-list'
})