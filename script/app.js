function showDiv(id) {
  document.querySelectorAll(".content").forEach((div) => {
    div.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

function searchTable() {
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toLowerCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  for (i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    td = tr[i].getElementsByTagName("td");
    for (j = 0; j < td.length; j++) {
      if (td[j]) {
        txtValue = td[j].textContent || td[j].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        }
      }
    }
  }
}

function toggleAudio(audioId, playIconId, pauseIconId) {
  var audioPlayer = document.getElementById(audioId);
  var playIcon = document.getElementById(playIconId);
  var pauseIcon = document.getElementById(pauseIconId);
  var audioIcon = document.getElementById("audioIcon");

  // إيقاف أي ملف صوتي آخر قيد التشغيل
  var allAudioPlayers = document.querySelectorAll("audio");
  allAudioPlayers.forEach(function (player) {
    if (player.id !== audioId && !player.paused) {
      player.pause();
      player.currentTime = 0; // إعادة تشغيل الملف الصوتي من البداية
      var playIconOther = document.getElementById(
        "playIcon" + player.id.slice(-1)
      );
      var pauseIconOther = document.getElementById(
        "pauseIcon" + player.id.slice(-1)
      );
      playIconOther.style.display = "inline";
      pauseIconOther.style.display = "none";
    }
  });

  if (audioPlayer.paused) {
    audioPlayer.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";
    audioIcon.classList.add("playing");
  } else {
    audioPlayer.pause();
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";
    audioIcon.classList.remove("playing");
  }
}

// loding

let loding = document.getElementById("loding");
let lood = document.getElementById("lood");
window.onload = function () {
  loding.style.display = "block";

  lood.style.display = "none";
};
