import {state , COLUMNS , createOrderData , TABLES , updateDragging } from './data.js'
import {createOrderHtml , createTableOptionsHtml ,html ,updateDraggingHtml ,moveToColumn} from './view.js'

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */


const handleDragOver = (event) => {
  event.preventDefault();
  const path = event.path || event.composedPath()
  let column = null

  for (const element of path) {
      const { area } = element.dataset
      if (area) {
          column = area
          break;
      }
  }

  if (!column) return
  updateDragging({ over: column })
  updateDraggingHtml({ over: column })
}


const handleDragStart = () => {
  updateDragging();
  updateDraggingHtml();
  handleDragOver();
  moveToColumn();
}
const handleDragEnd = () => {
  updateDragging();
  updateDraggingHtml();
  handleDragOver();
  moveToColumn();
}
const handleHelpToggle = () => {
  const helpOverlay = html.help.overlay;
  const helpCancel = html.help.cancel;

  if (helpOverlay.style.display === 'block') {
    helpOverlay.style.display = 'none';
  } else {
    helpOverlay.style.display = 'block';
  }

  helpCancel.addEventListener('click', () => {
    helpOverlay.style.display = 'none';
  });
};

const handleAddToggle = () => {
  const addOverlay = html.add.overlay
  addOverlay.style.display = 'block'
  createOrderHtml()
  createOrderData();

 
}
const addCancelButton = document.querySelector('[data-add-cancel]')
const addOverlay2 = html.add.overlay
addCancelButton.addEventListener('click', ()=>{
   addOverlay2.style.display = 'none'
   
  });


const handleAddSubmit = (event) => {
    event.preventDefault()
  const order ={
    title : html.add.title.value,
    table : html.add.table.value
  }
  
    let orderData = createOrderData(order)
    html.add.overlay.style.display = ''
    const changeOfOrder = createOrderHtml(orderData)
    const customerOrder = html.other.grid.querySelector('[data-column ="ordered"]')
    customerOrder.innerHTML = changeOfOrder.innerHTML
  };
  

const handleEditToggle = () => {
    const editOverlay = html.edit.overlay;
    const editForm = html.edit.form;
    const editDeleteButton = html.edit.delete;
    //const editCancel = html.edit.cancel;
  
    if (editOverlay.style.display === 'block') {
      editOverlay.style.display = '';
      editForm.reset();
      editDeleteButton.style.display = 'none';
    } else {
      editOverlay.style.display = 'block';
    }
  }
  

const handleEditSubmit = (event) => {
    event.preventDefault();
  
    // Get the order data from the form
    const order = {
      title: html.edit.title.value,
      table: html.edit.table.value,
    };
     // Update the order data in the state
     state.orders === state.orders.map((orderItem) => {
      if (orderItem.id === state.dragging.id) {
          return { ...orderItem, ...order };//spread operator
      } else {
          return orderItem;
      }
  });
  const orderedColumn = html.other.grid.querySelector('[data-column="ordered"]');
    const editedOrderElement = orderedColumn.querySelector(`[data-id="${state.dragging.id}"]`);
    const orderData = createOrderData(order);
    const newOrderHtml = createOrderHtml(orderData);
    editedOrderElement.innerHTML = newOrderHtml.innerHTML;

    updateDragging();
    updateDraggingHtml();

      // Hide the edit form and reset the delete button
      const editOverlay = html.edit.overlay;
      const editForm = html.edit.form;
      const editDeleteButton = html.edit.delete;
      editOverlay.style.display = '';
      editForm.reset();
      editDeleteButton.style.display = '';

}
const handleDelete = () => {

  const deleteButton = html.edit.delete;
  const editForm = html.edit.form;
  const orderedColumn = html.other.grid.querySelector('[data-column="ordered"]');

  if (deleteButton.style.display === 'block') {
    // Delete the order data
    state.orders = state.orders.filter((order) => order.id !== state.dragging.id);

    // Update the HTML
    const orderElement = orderedColumn.querySelector(`[data-id="${state.dragging.id}"]`);
      if(orderElement){
        orderElement.remove()
      }
    // Reset the dragging state
    updateDragging();
    updateDraggingHtml();

    // Reset the form and hide the delete button
    editForm.reset();
    deleteButton.style.display = '';
  } else {
    deleteButton.style.display = 'block';
  }
}

const addButton = document.querySelector('[data-add]')

addButton.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
  htmlColumn.addEventListener('dragstart', handleDragStart)
  htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
  htmlArea.addEventListener('dragover', handleDragOver)
}
