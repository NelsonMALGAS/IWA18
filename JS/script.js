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
}
const handleDragEnd = () => {
  updateDragging();
  updateDraggingHtml();
  handleDragOver();
}
const handleHelpToggle = () => {
  const helpOverlay = html.help.overlay
  helpOverlay.style.display = 'block'
  //const helpCancelButton = html.help.overlay
  

}
const handleAddToggle = () => {
  const addOverlay = html.add.overlay
  addOverlay.style.display = 'block'
srOnlyElements.forEach(element => {
  element.style.position = 'static';
  element.style.clip = 'auto';
  element.style.height = 'auto';
  element.style.width = 'auto';
  element.style.overflow = 'visible';
  element.style.whiteSpace = 'normal';
})

  createOrderHtml()
  createOrderData();
  
}

const handleAddSubmit = (event) => {
    event.preventDefault()
  const order ={
    title : html.add.title.value,
    table : html.add.table.value
  }
  
    let orderData = createOrderData(order)
    html.add.overlay.style.display = ''
    const bbb = createOrderHtml(orderData)
    const customerOrder = html.other.grid.querySelector('[data-column ="ordered"]')
    customerOrder.innerHTML = bbb.innerHTML
  };
  

const handleEditToggle = () => {}
const handleEditSubmit = () => {
       createOrderHtml();
       createOrderData();
}
const handleDelete = () => {
  const deleteButton = document.querySelector('[data-edit-delete]')
  deleteButton.style.display = 'block'
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
