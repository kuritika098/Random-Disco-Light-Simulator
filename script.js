document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    const resetButton = document.getElementById('reset');
    const timerDisplay = document.getElementById('timerDisplay');
    const randomizeButton = document.getElementById('randomize');
    const musicSelect = document.getElementById('musicSelect');
    
    // Create and append the pause/start button
    const pauseStartButton = document.createElement('button');
    pauseStartButton.id = 'pauseStartBtn';
    pauseStartButton.style.display = 'none';
    pauseStartButton.textContent = 'Pause';
    pauseStartButton.ariaLabel = 'Pause/Start';
    document.body.appendChild(pauseStartButton);
    
    let timerInterval;
    let musicAudio;
    let isPaused = false;
    let countdownValue;
    let lightInterval;

    submitButton.addEventListener('click', () => {
        // alert("Double click on the screen to reload!");
        // pauseStartButton.style.display = 'block'; // Show the pause button
        console.log("Submit button clicked");
        run()
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        pauseStartButton.style.display = 'none'; // Hide the pause button
        document.getElementById('color').value='';
        document.getElementById('color1').value='';
        document.getElementById('color2').value='';
        document.getElementById('time').value='';
        document.getElementById('view').value='';
        document.getElementById('countdown').value='';
        document.getElementById('unit').value='';
        document.getElementById('sound').value='';
        // window.location.reload();
        // clearInterval(timerInterval);
    });

    pauseStartButton.addEventListener('click', () => {
        if (isPaused) {
            resumeSimulation();
        } else {
            pauseSimulation();
        }
    });


    function startCountdown(duration) {
        countdownValue = duration;
        // alert("Double click on the screen to reload!");
        document.getElementById('musicDropdown').style.display = 'block'; 
        // document.getElementById('musicDropdown').style.display = 'block';  
        pauseStartButton.style.display = 'block'; // Show the pause button
        timerDisplay.style.display = 'block';

        timerInterval = setInterval(() => {
            if (!isPaused) {
                let minutes = Math.floor(countdownValue / 60);
                let seconds = Math.floor(countdownValue % 60);

                timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;

                if (--countdownValue < 0) {
                    clearInterval(timerInterval);
                    stopSimulation();
                    timerDisplay.style.display = 'none';
                }
            }
        }, 1000);
    }

    function pad(number) {
        return number.toString().padStart(2, '0');
    }

    function stopSimulation() {
        const replayModelEl = document.getElementById('replayModel');
        replayModelEl.style.display = 'block';
    }

    document.getElementById('replayModelBtn').addEventListener('click', function () {
        const replayModelEl = document.getElementById('replayModel');
        replayModelEl.style.display = 'none';
        run();
    });

    document.getElementById('exitBtn').addEventListener('click', function () {
        window.location.reload();
        run();
    });

    function run() {
        let countdownValue = document.getElementById('countdown').value;
        let n = document.getElementById("color").value;
        let set_time = document.getElementById("time").value;
        let unit = document.getElementById("unit").value;
        let view = document.getElementById("view").value;
        let soundEffect = document.getElementById("sound").value;
        let color1 = document.getElementById('color1').value;
        let color2 = document.getElementById('color2').value;

        if (countdownValue && countdownValue > 0 && Number(n) >= 0 && Number.isInteger(Number(n)) && n !== "" && unit !== "unit" && view !== "select") {
            document.getElementById("error").innerHTML = "";
            document.querySelector(".footer").style.display = "none";
            document.querySelector(".navHeader").style.display = "none";
            document.querySelector(".container").style.display = "none";
            startSimulation(n, set_time, unit, view, color1, color2);
            var backToTopBtn = document.getElementById("backToTopBtn");
            backToTopBtn.style.display = "none";
            startCountdown(countdownValue);

            if (musicAudio) {
                musicAudio.pause();
            }
            const audio = document.getElementById(soundEffect);
            audio.loop = true;
            audio.play();
            musicAudio = audio;

            document.getElementById('musicDropdown').style.display = 'block';
            pauseStartButton.style.display = 'block'; // Show the pause/start button
        } else {
            document.getElementById("error").style.color = "red";
            if (Number(n) < 0 || !Number.isInteger(Number(n)) || n === "") {
                document.getElementById("error").innerHTML = "<strong>The Number of Colours must be a positive integer.</strong>";
            } else if (unit === "unit") {
                document.getElementById("error").innerHTML = "<strong>The Unit field must be selected.</strong>";
            } else if (view === "select") {
                document.getElementById("error").innerHTML = "<strong>The View field must be selected.</strong>";
            } else if (countdownValue <= 0) {
                document.getElementById("error").innerHTML = "<strong>The CountDown Timer must be a positive value greater than zero.</strong>";
            }
            return;
        }
    }

    function startSimulation(n, set_time, unit, view, color1, color2) {
        const rgbColor1 = hexToRgb(color1);
        const rgbColor2 = hexToRgb(color2);

        document.body.querySelector(".snowflakes").style.display = 'none';
        document.body.querySelector("#particles-js").style.display = 'none';
        document.body.style.cursor = "pointer";
        document.querySelector("#fullscreenBtn").style.right = "auto";
        document.querySelector("#fullscreenBtn").style.left = "20px";
        document.querySelector("#CommentBtn").style.display = "none";

        // document.body.addEventListener("dblclick", () => {
        //     let cnf1 = confirm("Are you sure you want to reload?");
        //     if (cnf1) {
        //         window.location.reload();
        //     }
        // });

        if (unit === "seconds") {
            set_time *= 1000;
        }

        function getRandomColorBetween(color1, color2) {
            if (color1.r === color2.r && color1.g === color2.g && color1.b === color2.b) {
                const randomR = Math.floor(Math.random() * 256);
                const randomG = Math.floor(Math.random() * 256);
                const randomB = Math.floor(Math.random() * 256);
                return `rgb(${randomR}, ${randomG}, ${randomB})`;
            }
            else {
                const randomR = Math.floor(Math.random() * (color2.r - color1.r + 1)) + color1.r;
                const randomG = Math.floor(Math.random() * (color2.g - color1.g + 1)) + color1.g;
                const randomB = Math.floor(Math.random() * (color2.b - color1.b + 1)) + color1.b;
                return `rgb(${randomR}, ${randomG}, ${randomB})`;
            }
        }

        function numberColorsBetween(color1, color2, num) {
            let colors = `${getRandomColorBetween(color1, color2)}`;
            while (num > 1) {
                colors += `, ${getRandomColorBetween(color1, color2)}`;
                num--;
            }
            return colors;
        }

        function createRandomGradientPattern(n) {
            let gradientPattern = `background-color: ${getRandomColorBetween(rgbColor1, rgbColor2)}; background-image: `;

            for (let i = 0; i < n; i++) {
                const randomPositionX = Math.floor(Math.random() * 100);
                const randomPositionY = Math.floor(Math.random() * 100);
                gradientPattern += `radial-gradient(circle at ${randomPositionX}% ${randomPositionY}%, ${getRandomColorBetween(rgbColor1, rgbColor2)} 0%, transparent 50%), `;
            }

            // Remove the last comma and space
            gradientPattern = gradientPattern.slice(0, -2);
            gradientPattern += '; background-blend-mode: normal;';

            return gradientPattern;
        }

        function applyRandomGradientPattern() {
            document.body.style.cssText = createRandomGradientPattern(n);
        }

        if (view === "custom") {
            applyRandomGradientPattern();
            lightInterval = setInterval(() => {
                if (!isPaused) {
                    applyRandomGradientPattern();
                }
            }, set_time);
        } else if (n == 1) {
            document.body.style.backgroundColor = getRandomColorBetween(rgbColor1, rgbColor2);
            lightInterval = setInterval(() => {
                if (!isPaused) {
                    document.body.style.backgroundColor = getRandomColorBetween(rgbColor1, rgbColor2);
                }
            }, set_time);
        } else {
            let gradientType = view === "conic" ? "conic-gradient" : view === "linear" ? "linear-gradient" : "radial-gradient";
            document.body.style.background = `${gradientType}(${numberColorsBetween(rgbColor1, rgbColor2, n - 1)}, ${getRandomColorBetween(rgbColor1, rgbColor2)})`;
            lightInterval = setInterval(() => {
                if (!isPaused) {
                    document.body.style.background = `${gradientType}(${numberColorsBetween(rgbColor1, rgbColor2, n - 1)}, ${getRandomColorBetween(rgbColor1, rgbColor2)})`;
                }
            }, set_time);
        }
    }

  randomizeButton.addEventListener('click', () => {
        const colorInput = document.getElementById('color');
        const randomNumColors = Math.floor(Math.random() * 10) + 1;
        colorInput.value = randomNumColors;

        // Stopped the random selection for 2nd input for better view:
        // const colorInput1 = document.getElementById('color1');
        // const randomColor1 =  "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        // colorInput1.value = randomColor1;

        // const colorInput2 = document.getElementById('color2');
        // const randomColor2 = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        // colorInput2.value = randomColor2;

        const timeInput = document.getElementById('time');

        const unitSelect = document.getElementById('unit');
        const randomUnitIndex = Math.random() < 0.5 ? 1 : 2;
        if (randomUnitIndex == 1) {
            var randomTimeInterval = Math.floor(Math.random() * 1000) + 1;
            timeInput.value = randomTimeInterval;
        }
        else {
            var randomTimeInterval = Math.floor(Math.random() * 10) + 1;
            timeInput.value = randomTimeInterval;
        }
        unitSelect.selectedIndex = randomUnitIndex;

        const viewSelect = document.getElementById('view');
        const randomViewIndex = Math.floor(Math.random() * (viewSelect.options.length - 1)) + 1;
        viewSelect.selectedIndex = randomViewIndex;

        const soundSelect = document.getElementById('sound');
        const randomSoundIndex = Math.floor(Math.random() * soundSelect.options.length);
        soundSelect.selectedIndex = randomSoundIndex;

        const countdownInput = document.getElementById('countdown');
        const randomCountdown = Math.floor(Math.random() * 300) + 30;
        countdownInput.value = randomCountdown;

        // Update music dropdown
        musicSelect.value = soundSelect.value;
    });
    let musicMuted = false; // Variable to track whether music is muted

    function pauseSimulation() {
        clearInterval(timerInterval);
        clearInterval(lightInterval);
        if (musicAudio) {
            musicMuted = musicAudio.muted; // Remember the mute state
            musicAudio.pause();
        }
        pauseStartButton.textContent = 'Start';
        isPaused = true;
    }
    
    function resumeSimulation() {
        startCountdown(countdownValue);
        if (musicAudio) {
            if (!musicMuted) {
                musicAudio.play();
            }
        }
        startSimulation(
            document.getElementById("color").value,
            document.getElementById("time").value,
            document.getElementById("unit").value,
            document.getElementById("view").value,
            document.getElementById('color1').value,
            document.getElementById('color2').value
        );
        pauseStartButton.textContent = 'Pause';
        isPaused = false;
    }
    

    function hexToRgb(hex) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => {
                    fullscreenBtn.textContent = 'Exit Fullscreen';
                })
                .catch(err => {
                    console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
                });
        } else {
            document.exitFullscreen()
                .then(() => {
                    fullscreenBtn.textContent = 'Fullscreen';
                })
                .catch(err => {
                    console.error(`Error attempting to disable fullscreen mode: ${err.message} (${err.name})`);
                });
        }
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.textContent = 'Fullscreen';
        }
    });
});

window.onload = function () {
    const modal = document.getElementById("warningModal");
    const closeModal = document.getElementById("closeModal");
    const proceedButton = document.getElementById("proceed");

    modal.style.display = "block";

    closeModal.onclick = function () {
        modal.style.display = "none";
    }

    proceedButton.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    const words = ["Light Simulator", "Beat Spectrum"];
    let index = 0;
    let direction = "left";
    const interval = 100;

    function animateText() {
        const word = words[index];
        const len = word.length;
        let i = direction === "left" ? 0 : len;
        const timer = setInterval(function () {
            $("#changing").text(word.substring(0, i));
            if (direction === "left") {
                i++;
                if (i > len) {
                    clearInterval(timer);
                    direction = "right";
                    animateText();
                }
            } else {
                i--;
                if (i === 0) {
                    clearInterval(timer);
                    index = (index + 1) % words.length;
                    direction = "left";
                    animateText();
                }
            }
        }, interval);
    }
    animateText();
    // Snowflakes animation logic
    const snowflakesContainer = document.querySelector(".snowflakes");
    const numberOfSnowflakes = 300;

    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement("div");
        snowflake.classList.add("snowflake");
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDelay = `${Math.random() * 10}s`; // Randomize animation delay
        snowflake.style.width = `${Math.random() * 6 + 2}px`; // Randomize snowflake size (2px to 8px)
        snowflake.style.height = `${Math.random() * 6 + 2}px`; // Randomize snowflake size (2px to 8px)
        snowflakesContainer.appendChild(snowflake);
    }
};

function showAboutPopup() {
    document.getElementById("aboutPopup").style.display = "block";
}

function closeAboutPopup() {
    document.getElementById("aboutPopup").style.display = "none";
}

function showFeaturesPopup() {
    document.getElementById('featuresPopup').style.display = 'block';
}

function closeFeaturesPopup() {
    document.getElementById('featuresPopup').style.display = 'none';
}
function darkMode() {
    let element = document.body;

    element.className = "dark-mode";

}
function lightMode() {
    let element = document.body;

    element.className = "light-mode";

}
document.getElementById('submit').addEventListener('click', function () {
   

    document.getElementById('musicDropdown').addEventListener('change', function () {
        const selectedMusic = this.value;
        const audioElements = document.querySelectorAll('audio');

        audioElements.forEach(audio => audio.pause());

        if (selectedMusic !== 'none') {
            document.getElementById(selectedMusic).play();
        }
    });
});
function effect() {
    loader.style.display = "none";
    document.querySelector(".unload").style.display = "block";
    document.querySelector(".snowflakes").style.display = "block";
    var backToTopBtn = document.getElementById("backToTopBtn");
    backToTopBtn.style.display = "block";
}



var loader = document.querySelector(".loader");
window.addEventListener('load', () => {
    let timout = setTimeout(effect, 4000);

    var backToTopBtn = document.getElementById("backToTopBtn");
    backToTopBtn.style.display = "none";

})

function changeColor() {
  document.getElementById('name').style.color = "black";
  document.getElementById('email').style.color = "black";
}

document.addEventListener("DOMContentLoaded", function() {
    var backToTopBtn = document.getElementById("backToTopBtn");
    backToTopBtn.style.display = "block";
    backToTopBtn.addEventListener("click", function() {
      scrollToTop();
      scrollToForm();
    });
  
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
    function scrollToForm() {
        const formElement = document.getElementById("box"); 
        formElement.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
  });

  function toggleSidebar() {
    var sidebar = document.querySelector('.sidebarOne');
    if (sidebar.style.display === 'block') {
      sidebar.style.display = 'none';
    } else {
      sidebar.style.display = 'block';
    }
  }
  document.querySelector('.cross').addEventListener('click', function() {
    document.querySelector('.sidebarOne').style.display = 'none';
  })
  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(() => {
        document.querySelector(".navMain").style.visibility = "visible";
    }, 4000);
  })


