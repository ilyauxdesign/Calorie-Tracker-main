//Storage Controller
function deleteItems() {
    window.localStorage.clear();
    location.reload();
}

const StorageCtrl = (function (){
    //public methods
    return {
        storeItem: function(item){
            let items;
            //check if any item in LS
            if(localStorage.getItem('items') === null){
                items = [];
                //push new item
                items.push(item);
                //set LS
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));
                //push new item
                items.push(item);
                //reset LS
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        updateLsItem: function( element , newElement ){

            let items;
            //check if any item in LS
            if(localStorage.getItem('items') === null){
                items = [];

                //set LS
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is already in ls
                items = JSON.parse(localStorage.getItem('items'));
                //push new item
                items.forEach(function (itemList,  index, value)
                {

                    if(element.id === value[index].id  )
                    {
                        items[index] = {id: value[index].id, name: newElement.name, calories: parseInt(newElement.calories)};

                    }

                });
            }
            //reset LS
            localStorage.setItem('items', JSON.stringify(items));

        },
        getItemsFromStorage: function (){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
}) ();


//Item Controller
const ItemCtrl = (function(){
    //Item Construction
    const Item = function(id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }

//Data Structure
    const data = {
        items: [
            /*  {id: 0, name: 'Steak Dinner', calories: 1200},
              {id: 1, name: 'Cake', calories: 900},
              {id: 2, name: 'Eggs', calories: 300}*/
        ],
        total: 0,
        currentItem: ''
    }

    return {
        getItems: function(){
            return data.items
        },
        setCurentItem: function(curItem){

            data.currentItem = curItem

        },
        getCurentItem: function(){
            return data.currentItem;
        },
        addItem: function (name, calories){
            let ID;
            //create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }
            //calories to number
            calories = parseInt(calories);
            //create new item
            newItem = new Item(ID, name, calories);
            //add to items array
            data.items.push(newItem);

            return newItem
        },
        sortReturnItem: function ( element, newElement){
            let List = StorageCtrl.getItemsFromStorage();

            for (let i = 0; i < List.length; i++) {
                if( element.id === List[i].id)
                {
                    List[i] = {id: List[i].id, name: newElement.name, calories: parseInt(newElement.calories)};

                }
            }
            return List;
        },
        //total calories
        getTotalCalories: function(){
            let total = 0;
            //loop through items and add calories
            data.items.forEach(function(item){
                total = total + item.calories;
            });
            //set total calories in data structure
            data.total = total;
            return data.total;
        },
        //total calories
        calcTotalCalories: function(cal){
            totals = 0;
            calcArray = []
            data.items = JSON.parse(localStorage.getItem('items'));
            data.items.forEach(function(item, index){
                if(item.calories === parseInt(cal)) {
                    data.items.splice(index, 1);

                }
            });

            data.items.forEach(function(item, index){
                calcArray.push(item.calories)
            });
            for (var i in calcArray) {
                totals += calcArray[i];
            }
            return totals;

        },
        calcTotalCaloriesBtn: function(){
            totals = 0;
            calcArray = []
            data.items = JSON.parse(localStorage.getItem('items'));
            data.items.forEach(function(item, index){
                calcArray.push(item.calories)
            });
            for (var i in calcArray) {
                totals += calcArray[i];
            }
            return totals;


        },
        logData: function(){
            return data
        }
    }
})();
//UI Controller
const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn',
        totalCalories: '.total-calories',
        deleteBtn: '.delete-btn',
        updateBtn: '.update-btn',
        clearBtn: 'clear-btn'
    }
    return{
        populateItemList: function(items){
            //create html content
            let html = '';

            //parse data and create list items html
            items.forEach(function (item) {
                html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}</strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
            <i class="fas fa-pencil-alt"></i>
        </a>
        </li>`
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function (){
            return UISelectors;
        },
        setItemInput: function (name, calories){

            document.querySelector(UISelectors.itemNameInput).value = name
            document.querySelector(UISelectors.itemCaloriesInput).value = calories
        },
        getItemInput: function (){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getListItems: function (element, calories){

            let itemsS = StorageCtrl.getItemsFromStorage()
            let selectedItem = '';
            let itemReplace = element.replace(/:/g, '')
            itemsS.forEach(function ( item) {
                if (item.name === itemReplace && item.calories === parseInt(calories) )
                {
                    selectedItem = item
                }
            });
            return selectedItem;

        },
        addListItem: function (item){
            //create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add ID
            li.id = `item-${item.id}`;
            //add HTML
            li.innerHTML = `<strong>${item.name}</strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fas fa-pencil-alt"></i>
            </a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        insertInput: function (name, calories){
            document.querySelector(UISelectors.itemNameInput).value = name;
            document.querySelector(UISelectors.itemCaloriesInput).value = calories;
        },
        clearInput: function (){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function (totalCalories){
            if(totalCalories !== null )
            {
                document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
            }
        }
    }
})();

//App Controller
const App = (function(ItemCtrl,StorageCtrl, UICtrl){
    //Load event listeners
    const loadEventListeners = function (){
        //get UI selectors
        const UISelectors = UICtrl.getSelectors();


        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        //select item item event
        document.querySelector(UISelectors.itemList).addEventListener('click', valiRida);
        document.querySelector(UISelectors.updateBtn).addEventListener('click', updateBtn);
        //ad document reload event
        document.addEventListener('DOMContentLoaded', getItemsFromStorage)
    }

    const valiRida = function(event){
        let itemName = event.target.parentNode.parentElement.querySelector('strong').textContent;
        let itemCal = event.target.parentNode.parentElement.querySelector('em').textContent;

        UICtrl.insertInput(itemName, itemCal)
        let UISelectors = UICtrl.getSelectors();

        let updateBtn = document.querySelector(UISelectors.updateBtn);
        let itemTag = event.target.parentNode.parentElement;
        let LSItem = UICtrl.getListItems(itemName, itemCal)

        ItemCtrl.setCurentItem(LSItem);

        updateBtn.style.visibility = "visible";
        itemTag.setAttribute('data-selected',  LSItem.id);


        // Add selected value to input fields like name and calories
        UICtrl.setItemInput(itemName,itemCal);


        event.preventDefault();

    }

    const updateBtn = function(event) {
        event.preventDefault();


        let UISelectors = UICtrl.getSelectors();
        let itemList = document.querySelector(UISelectors.itemList);
        let newInput = UICtrl.getItemInput()
        const items = StorageCtrl.getItemsFromStorage()
        let CurentItem = ItemCtrl.getCurentItem();
        let newArrayList = ItemCtrl.sortReturnItem( CurentItem, newInput)

        StorageCtrl.updateLsItem( CurentItem, newInput);

        UICtrl.populateItemList(newArrayList)

        if( CurentItem.length !== 0 ) {
            let totalCalories = ItemCtrl.calcTotalCaloriesBtn();

            UICtrl.showTotalCalories(totalCalories);
        }

        event.preventDefault();

        UICtrl.clearInput()
        event.preventDefault();


    };
    //item add submit function
    const itemAddSubmit = function(event){

        const input = UICtrl.getItemInput()
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
            //add item to UI items list
            UICtrl.addListItem(newItem)

            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            //store in localStorage
            StorageCtrl.storeItem(newItem);
            //clear fields
            UICtrl.clearInput()
        }
        event.preventDefault()
    }
    //get items from Storage
    const getItemsFromStorage = function (){
        const items = StorageCtrl.getItemsFromStorage()
        //set storage items to ItemCtrl data items
        items.forEach(function (item){
            ItemCtrl.addItem(item['name'], item['calories'])
        })
        ///get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        //populate items list
        UICtrl.populateItemList(items)
    }
    return {
        init: function (){

            //fetch items from data structure
            const items = ItemCtrl.getItems()
            //populate items list
            UICtrl.populateItemList(items)
            //load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize App
App.init()
