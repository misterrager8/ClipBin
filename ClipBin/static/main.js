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

function refreshPage() {
    $('#pageContent').load(location.href + ' #pageContent');
}

function copyClip(clipId) {
    $('#clipContent' + clipId).show();
    document.getElementById('clipContent' + clipId).select();
    document.execCommand('copy');
    $('#clipContent' + clipId).hide();
    
    $('#copyBtn' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    setTimeout(function() {
        $('#copyBtn' + clipId).toggleClass('bi-clipboard bi-clipboard-check text-success');
    }, 1000);
}