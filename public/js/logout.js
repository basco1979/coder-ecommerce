const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async (e) => {
    const result = await fetch('/api/session/logout', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const {redirect} = await result.json();
    window.location.href = redirect;
});