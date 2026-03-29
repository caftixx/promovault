const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

document.body.style.cursor = 'none';

document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(function() {
        ring.style.left = e.clientX + 'px';
        ring.style.top = e.clientY + 'px';
    }, 80);
});

document.querySelectorAll('a, button').forEach(function(el) {
    el.style.cursor = 'none';
    el.addEventListener('mouseenter', function() {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        ring.style.width = '50px';
        ring.style.height = '50px';
        ring.style.borderColor = 'rgba(212,175,55,0.8)';
    });
    el.addEventListener('mouseleave', function() {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        ring.style.width = '36px';
        ring.style.height = '36px';
        ring.style.borderColor = 'rgba(212,175,55,0.5)';
    });
});
