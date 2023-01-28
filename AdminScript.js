
// const link="http://192.168.137.1:5000/"
const link="http://127.0.0.1:5000/"
// const link=" https://9e33-106-51-8-242.ngrok.io/"
// const link="https://finalquizapp.herokuapp.com/"


/////////////////////////////////////////


addFetch()
addQuestions()

/////////update-canteen-table/////
function addFetch(){
    $("#user-list").empty()
    fetch(link+"/getUsers",{
    method:"GET",   
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer '+token(1)
      }}            
    ).then(response => {
            if(response.status==200){//remove it
                console.log("Recieved Users from Database!!!")
            }
            return response.json()})
        .then(response => {
            for(var i = 0; i < (response.users).length; i++) {
                var obj = response.users[i];
                    $("#user-list").append(
                        `<tr class="d-flex" id="${obj.userId}">
                        <td class="col-1">${obj.userId}}</td>
                        <td class="col-5">${obj.userName}</td>
                        <td class="col-1">
                            <div class="btn btn-primary" onclick="detailsModal((this.parentNode).parentNode)">
                            <i class="fa fa-info"></i>
                            </div>
                        </td>
                        <td class="col-3">${obj.city}</td>
                        <td class="col-5">${obj.school}</td>
                        <td class="col-2">${obj.grade}</td>
                        <td class="col-3">${obj.mobileNo}</td>
                        <td class="col-4">${new Date(obj.registrationDate).toDateString()}</td>
                        <td class="col-1">
                            <div class="btn btn-danger" onclick="deleteUser((this.parentNode).parentNode)">
                            <i class="fa fa-trash"></i>
                            </div>
                        </td>
                      </tr>`
                    );
            }
        }).catch(function(error){
            console.error(String(error));
            if(error=="TypeError: Failed to fetch"){
                alert("The Server is Offline !")
            }
        });
    }













///////
function detailsModal(element){
    fetch(link+"/getUserDetails="+element.id,{
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer '+token(1)
          }}            
        ).then(response => {
                if(response.status==200){//remove it
                    console.log("Recieved History of User!!!")
                }
                return response.json()})
            .then(response => {
                if(response.history[0]==null){
                    alert("The User hasnt Attempted any Quiz yet")
                    return
                }
                console.log(response)
                $("body").before(`
                    <!-- The Modal -->
                    <div id="myModal" class="modal">
                    <!-- Modal content -->
                        <div class="modal-content">
                            <h1>${response.history[0].userName}</h1>
                            <div>Attempts: ${(response.history).length}</div>
                            <div class="modal-tabular table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr class="d-flex">
                                    <th scope="col" class="col-1">#</th>
                                    <th scope="col" class="col-4">Score</th>
                                    <th scope="col" class="col-7">Date</th>
                                    </tr>
                                </thead>
                                <tbody id="attempts-list">
                                
                                    
                                </tbody>
                            </table>
                            </div>

                            <div class="modal-buttons">
                                <button type="button" class="btn btn-danger" onclick="(((this.parentNode).parentNode).parentNode).remove()">Cancel</button>
                            </div>
                        </div>
                    </div>
                    `);
                for(var i = 0; i < (response.history).length; i++) {
                    var obj = response.history[i];
                    $("#attempts-list").append(
                        `<tr class="d-flex">
                        <td class="col-1">${i+1}</th>
                        <td class="col-4">${obj.score}</td>
                        <td class="col-7">
                        ${new Date(obj.startedDateTime).toDateString()}
                        </td>
                    </tr>`
                    );
                }
            }).catch(function(error){
                console.error(String(error));
                if(error=="TypeError: Failed to fetch"){
                    alert("The Server is Offline !")
                }
            });
}




////MODAL FOR EACH TYPE/////////
function modal(type){
    var warning
    if(type==1){
        warning="Are you sure you want to add the Question ?"
    }
    if(type==2){
        warning="Are you sure you want to Delete this User ?"
    }


    $(function(){
        $("body").before(`
        <!-- The Modal -->
        <div id="myModal" class="modal">
        <!-- Modal content -->
            <div class="modal-content">
                <p>${warning}</p>
                <div class="modal-buttons">
                    <button type="button" class="btn btn-success" onclick="confirm(${type},((this.parentNode).parentNode).parentNode)">Yes!</button>
                    <button type="button" class="btn btn-danger" onclick="(((this.parentNode).parentNode).parentNode).remove()">Cancel</button>
                </div>
            </div>
        </div>
        `);
    });
}

///FETCH API CALLS/////
function confirm(type,elementhide){

    if(type==1){
        elementhide.remove()
        question=document.getElementById('exampleInputEmail1').value
        var choicesDict=[]
        $( 'input[type="checkbox"]' ).each(function( index ) {

            if ($(this).is(":checked")){
                rightchoice=1
            }else{
                rightchoice=0
            }
            choicesDict.push({"choice":$(this).next().val(),"rightChoice":rightchoice})
          });

        fetch(link+"/insertQuestion",{
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
              },
              body:JSON.stringify(
                    {
                     questionText:question,
                     choices:choicesDict})
                    }).then(response => {
                    if (response.status==200){
                        clear_form_elements()
                    }
                    
        }).catch(function(error){
            console.error(String(error));
            if(error=="TypeError: Failed to fetch"){
                alert("The Server is Offline !")
            }
        });
        

    }

    if(type==2){
        fetch(link+"/deleteUser="+Setelement.id,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              }
            }).then(response => {
                if (response.status==200){
                    elementhide.remove()
                    Setelement.remove()
                    Setelement=""
                }
                
            }).catch(function(error){
                console.error(String(error));
                if(error=="TypeError: Failed to fetch"){
                    alert("The Server is Offline !")
                }})
        
    }


}


$(document).on('click', 'input[type="checkbox"]', function() {      
    $('input[type="checkbox"]').not(this).prop('checked', false);      
});


function clear_form_elements() {
    $(".question-section").find(':input').each(function() {
      switch(this.type) {
          case 'password':
          case 'text':
          case 'textarea':
          case 'file':
          case 'select-one':
          case 'select-multiple':
          case 'date':
          case 'number':
          case 'tel':
          case 'email':
              jQuery(this).val('');
              break;
          case 'checkbox':
          case 'radio':
              this.checked = false;
              break;
      }
    });
  }