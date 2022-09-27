$(document).ready(function() {{
    localStorage.getItem('ClipBin') === 'dark' ? setDark() : setLight();
}});

function setDark() {{
    localStorage.setItem('ClipBin', 'dark');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('ClipBin'));
    $('#dark').show();
    $('#light').hide();
}}

function setLight() {{
    localStorage.setItem('ClipBin', 'light');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('ClipBin'));
    $('#light').show();
    $('#dark').hide();
}}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function copyClip(clipId) {
    x = document.getElementById('content' + clipId);
    x.style.display = 'block';
    x.select();
    document.execCommand('copy');
    x.style.display = 'none';

    $('#copyClip' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    setTimeout(function() {
        $('#copyClip' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    }, 1000);
}
