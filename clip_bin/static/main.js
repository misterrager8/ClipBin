$(document).ready(function() {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('ClipBin'));
});

function changeTheme(theme) {
    localStorage.setItem('ClipBin', theme);
    document.documentElement.setAttribute('data-theme', localStorage.getItem('ClipBin'));
}

function toggleDiv(divId) {
    $('#' + divId).fadeToggle(150);
}

function copyClip(clipId) {
    $('#copyClip' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    setTimeout(function() {
        $('#copyClip' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    }, 1000);
}
