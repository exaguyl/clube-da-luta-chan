document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment');
    const usernameInput = document.getElementById('username');
    const imageUrlInput = document.getElementById('image-url');
    const commentsContainer = document.getElementById('comments');

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.forEach(comment => {
            addCommentToDOM(comment.text, comment.username, comment.date, comment.imageUrl, comment.replies);
        });
    }

    function addCommentToDOM(commentText, username, date, imageUrl, replies = [], parentElement = commentsContainer) {
        const comment = document.createElement('div');
        comment.classList.add('comment');

        const commentHeader = document.createElement('div');
        commentHeader.classList.add('comment-header');

        const commentUser = document.createElement('span');
        commentUser.classList.add('user');
        commentUser.textContent = `Nome: ${username}`;

        const commentDate = document.createElement('span');
        commentDate.classList.add('date');
        commentDate.textContent = date;

        commentHeader.appendChild(commentUser);

        const spacer = document.createElement('div');
        spacer.classList.add('spacer');

        commentHeader.appendChild(spacer);
        commentHeader.appendChild(commentDate);

        comment.appendChild(commentHeader);

        const commentTextElement = document.createElement('div');
        commentTextElement.classList.add('comment-text');
        commentTextElement.textContent = commentText;

        comment.appendChild(commentTextElement);

        if (imageUrl) {
            const commentImage = document.createElement('img');
            commentImage.classList.add('comment-image');
            commentImage.src = imageUrl;
            comment.appendChild(commentImage);
        }

        const replyButton = document.createElement('button');
        replyButton.classList.add('reply-button');
        replyButton.textContent = 'Responder';
        replyButton.addEventListener('click', () => {
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        });

        comment.appendChild(replyButton);

        const replyForm = document.createElement('form');
        replyForm.classList.add('reply-form');
        replyForm.innerHTML = `
            <input type="text" class="reply-username" placeholder="Nome de usuário">
            <textarea class="reply-comment" placeholder="Escreva sua resposta aqui..." required></textarea>
            <button type="submit">Enviar</button>
        `;

        replyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const replyUsername = replyForm.querySelector('.reply-username').value;
            const replyComment = replyForm.querySelector('.reply-comment').value;

            if (replyComment.trim() !== '') {
                const replyDate = new Date().toLocaleString();
                addReplyToDOM(replyComment, replyUsername, replyDate, comment);
                saveReply(commentText, username, date, replyComment, replyUsername, replyDate);
                replyForm.querySelector('.reply-username').value = '';
                replyForm.querySelector('.reply-comment').value = '';
                replyForm.style.display = 'none';
            }
        });

        comment.appendChild(replyForm);

        parentElement.insertBefore(comment, parentElement.firstChild);

        replies.forEach(reply => {
            addReplyToDOM(reply.text, reply.username, reply.date, comment);
        });
    }

    function addReplyToDOM(replyText, username, date, parentComment) {
        const reply = document.createElement('div');
        reply.classList.add('reply');

        const replyHeader = document.createElement('div');
        replyHeader.classList.add('comment-header');

        const replyUser = document.createElement('span');
        replyUser.classList.add('user');
        replyUser.textContent = `Nome: ${username}`;

        const replyDate = document.createElement('span');
        replyDate.classList.add('date');
        replyDate.textContent = date;

        replyHeader.appendChild(replyUser);

        const spacer = document.createElement('div');
        spacer.classList.add('spacer');

        replyHeader.appendChild(spacer);
        replyHeader.appendChild(replyDate);

        reply.appendChild(replyHeader);

        const replyTextElement = document.createElement('div');
        replyTextElement.classList.add('comment-text');
        replyTextElement.textContent = replyText;

        reply.appendChild(replyTextElement);

        parentComment.appendChild(reply);
    }

    function saveComment(commentText, username, imageUrl) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        const date = new Date().toLocaleString();
        const newComment = { text: commentText, username: username, date: date, imageUrl: imageUrl, replies: [] };
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
        return newComment;
    }

    function saveReply(parentCommentText, parentUsername, parentDate, replyText, replyUsername, replyDate) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        const comment = comments.find(c => c.text === parentCommentText && c.username === parentUsername && c.date === parentDate);
        if (comment) {
            comment.replies.push({ text: replyText, username: replyUsername, date: replyDate });
            localStorage.setItem('comments', JSON.stringify(comments));
        }
    }

    loadComments();

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const commentText = commentInput.value;
        const username = usernameInput.value;
        const imageUrl = imageUrlInput.value;

        if (commentText.trim() !== '') {
            const newComment = saveComment(commentText, username, imageUrl);
            addCommentToDOM(newComment.text, newComment.username, newComment.date, newComment.imageUrl);
            commentInput.value = '';
            usernameInput.value = '';
            imageUrlInput.value = '';
        }
    });
});