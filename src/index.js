document.addEventListener("DOMContentLoaded", () => {
    const goodDogFilter = document.getElementById("good-dog-filter");
    const dogBar = document.getElementById("dog-bar");
    const dogInfoDiv = document.getElementById("dog-info");
    const dogBad = "Bad Dog!";
    const dogGood = "Good Dog!";
  
    let dogs = []; // Array to store all dogs
    let dogBarButtonStatus = 0; // Initial filter status
  
    fetch("http://localhost:3000/pups")
      .then(res => res.json())
      .then(data => {
        dogs = data;
        generateDogBar();
  
        goodDogFilter.addEventListener("click", () => {
          dogBarButtonStatus = 1 - dogBarButtonStatus; // Toggle filter status
          goodDogFilter.textContent = dogBarButtonStatus === 1 ? "Filter good dogs: ON" : "Filter good dogs: OFF";
          generateDogBar();
        });
      });
  
    function generateDogBar() {
      dogBar.innerHTML = "";
      const filteredDogs = dogBarButtonStatus === 1 ? dogs.filter(dog => dog.isGoodDog) : dogs;
  
      filteredDogs.forEach((dog) => {
        const dogName = dog.name;
        let dogStatus = dog.isGoodDog;
        const dogPics = dog.image;
        const dogId = dog.id;
  
        const dogSpan = document.createElement("span");
        dogSpan.textContent = dogName;
        dogBar.append(dogSpan);
  
        dogSpan.addEventListener("click", (e) => {
          dogInfoDiv.innerHTML = "";
          const dogNameAttach = document.createElement("h2");
          dogNameAttach.textContent = dogName;
          const dogImgAttach = document.createElement("img");
          dogImgAttach.src = dogPics;
          const dogButtonStatus = document.createElement("button");
          dogButtonStatus.textContent = dogStatus ? dogGood : dogBad;
  
          function changeDogStatus() {
            dogButtonStatus.removeEventListener("click", toggleDogStatus);
            dogButtonStatus.addEventListener("click", toggleDogStatus);
          }
  
          function toggleDogStatus() {
            const newDogStatus = !dogStatus;
            const dogUpdate = { "isGoodDog": newDogStatus };
            return fetch(`http://localhost:3000/pups/${dogId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(dogUpdate)
            })
              .then(res => res.json())
              .then(data => {
                console.log(data);
                dogStatus = newDogStatus; // Update the dog's status variable
  
                // Update the dog's status in the dogs array
                const dogIndex = dogs.findIndex(d => d.id === dogId);
                if (dogIndex !== -1) {
                  dogs[dogIndex].isGoodDog = newDogStatus;
                }
  
                dogButtonStatus.textContent = newDogStatus ? dogGood : dogBad;
  
                if (!newDogStatus && dogBarButtonStatus === 0) {
                  dogSpan.remove(); // Remove the dog from the dogBar if it is not good and the filter is enabled
                }
                else if(newDogStatus && dogBarButtonStatus === 1) {
                    dogBar.append(dogSpan)
                }
              });
          }
  
          changeDogStatus();
          dogInfoDiv.append(dogImgAttach, dogNameAttach, dogButtonStatus);
        });
      });
    }
  });