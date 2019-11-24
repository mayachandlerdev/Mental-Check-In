var trash = document.getElementsByClassName("fa-trash");



//need
//can stay
Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const answers = this.parentNode.parentNode.childNodes[3].innerText
        fetch('answers', { //should fetch users?
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'users': answers
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
