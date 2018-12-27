// OGOLNE
// 1. Zmiana stylu css na click
// 2. walidacja formualrza
// 3. usuwanie elementu

class App extends React.Component {
   state = {
      incomes: [],
      expenses: [],
      totalIncome: 0,
      totalExpense: 0,
      totalBudget: 0,
      isOpen: false,
      modalType: '',
      elementName: '',
      elementValue: '',
      selected: 'Show All'
   }

   handleOpenModalClick = (type) => {
      this.setState({
         isOpen: true,
         modalType: type
      })
   }

   handleCloseModalClick = () => {
      this.setState({
         isOpen: false,
         elementName: '',
         elementValue: ''
      })
   }

   handleInputChange = (event, type) => {
      if(type === 'name') {
         this.setState({
            elementName: event.currentTarget.value
         })
      } else if(type === 'value') {
         this.setState({
            elementValue: event.currentTarget.value
         })
      }
   }

   handleAddElementClick = (type) => {
      let incomes, expenses;
      
      incomes = this.state.incomes;
      expenses = this.state.expenses;

      this.state.elementValue = parseInt(this.state.elementValue,10);

      if(type === 'Add Income') {
         incomes.push({name: this.state.elementName, value: this.state.elementValue, type: this.state.modalType});
         
         this.setState( prevState => ({
            totalIncome: prevState.totalIncome+this.state.elementValue
         }))
      } else {
         expenses.push({name: this.state.elementName, value: this.state.elementValue, type: this.state.modalType});
         
         this.setState( prevState => ({
            totalExpense: prevState.totalExpense+this.state.elementValue
         }))
      }

      this.setState( prevState => ({
         incomes,
         expenses,
         totalBudget: prevState.totalIncome-prevState.totalExpense,
         isOpen: false,
         elementName: '',
         elementValue: ''
      }))
   }

   handleFilterElementsClick = (type) => {
      this.setState({
         selected: type
      })
   }  

   showElements = () => {
      switch (this.state.selected) {
         case 'Show All': 
            let incomes = this.state.incomes.map(currentElement => <ListElement {...currentElement}/>);
            let expenses = this.state.expenses.map(currentElement => <ListElement {...currentElement}/>);
            return [incomes, expenses];
         case 'Show Incomes':
            incomes = this.state.incomes.map(currentElement => <ListElement {...currentElement}/>);
            return incomes;
         case 'Show Expenses':
            expenses = this.state.expenses.map(currentElement => <ListElement {...currentElement}/>);
            return expenses;
      }    
   }

   render() { 
      return (  
         <div className='app'>
            <Header 
               openModalClick={this.handleOpenModalClick}
            />
            <Body 
               totalIncome={this.state.totalIncome}
               totalExpense={this.state.totalExpense}
               totalBudget={this.state.totalBudget}
            />
            {this.state.isOpen && <Modal
               isOpen={this.state.isOpen}
               modalType={this.state.modalType}
               elementName={this.state.elementName}
               elementValue={this.state.elementValue}
               closeModalClick={this.handleCloseModalClick}
               inputChange={this.handleInputChange}
               addElementClick={this.handleAddElementClick}
            />}
            <ButtonFilters 
               selected={this.state.selected}
               filterElementsClick={this.handleFilterElementsClick}
            />
            {this.showElements()}
         </div>
      );
   }
}

const Header = ({openModalClick}) => (
   <header className='app__header'>
      <IconAdd 
         src='img/income.svg'
         text='Add Income'
         openModalClick={openModalClick}
      />
      <Title />
      <IconAdd 
         src='img/expense.svg'
         text='Add Expense'
         openModalClick={openModalClick}
      />
   </header>
)

const IconAdd = ({src, text, openModalClick}) => (
   <div className='header__button' onClick={ () => openModalClick(text)}>
      <img src={src} alt={text}/>
      {text}
   </div>
)

const Title = () => (
   <h1 className='app__title'>Budget Manager App</h1>
)

const Body = ({totalIncome, totalExpense, totalBudget}) => (
   <div className='app__body'>
      <Bar 
         nameClass='income'
         type='Total Income:'
         totalBudget={totalIncome}
      />
      <TotalBudget 
         totalBudget={totalBudget}
      />
      <Bar 
         nameClass='expense'
         type='Total Expense:'
         totalBudget={totalExpense}
      />
   </div>
)

const Bar = ({nameClass, type, totalBudget}) => (
   <div className={`body__bar ${nameClass}`}>
      <p>{type}</p>
      <span>{totalBudget} PLN</span>
   </div>
)
 
const TotalBudget = ({totalBudget}) => (
   <div className='body__total-budget'>
      <p>My Budget</p>
      <div>
         {totalBudget}
         <span>PLN</span>
      </div>
   </div>
)

const Modal = ({isOpen, modalType, elementName, elementValue, closeModalClick, inputChange, addElementClick}) => {
   
   const style = modalType === 'Add Income' ? {color: '#00E676'} : { color: '#E6004C'};

   return(
      <div className='container__modal'> 
         <dialog className='modal' open={isOpen}>
            <CloseModal 
               closeModalClick={closeModalClick}
            />
            <p style={style} className='modal__title'>{modalType}</p> 
            <ModalForm 
               elementName={elementName}
               elementValue={elementValue}
               inputChange={inputChange}
            />
            <ButtonSubmit 
               modalType={modalType}
               addElementClick={addElementClick}
            />
         </dialog>
      </div>
   )
}

const CloseModal = ({closeModalClick}) => (
   <div className='modal__close' onClick={ () => closeModalClick()}>
      &times;
   </div>
)

const ModalForm = ({elementName, elementValue, inputChange}) => (
   <form className='modal__form'>    
      <ModalInputName 
         elementName={elementName}
         inputChange={inputChange}
      />
      <ModalInputValue 
         elementValue={elementValue}
         inputChange={inputChange}
      />
   </form>
)
 
const ModalInputName = ({elementName, inputChange}) => (
   <div>
      <div className='form__description'>
         Description
      </div>   
      <input className='form__input' type='text' value={elementName} onChange={(event) => inputChange(event, 'name')}/>
   </div>
)

const ModalInputValue = ({elementValue, inputChange}) => (
   <div>
      <div className='form__description'>
         Value
      </div>   
      <input className='form__input' type='number' value={elementValue} onChange={ (event) => inputChange(event, 'value')}/>
   </div>
)

const ButtonSubmit = ({modalType, addElementClick}) => {
   
   const nameClass = modalType === 'Add Income' ? 'button__income-add' : 'button__expense-add'; 

   return(
      <button onClick={() => addElementClick(modalType)} className={`form__button ${nameClass}`}>{modalType}</button>
   )
}

const ButtonFilters = ({filterElementsClick}) => (
   <div className='app__filter-buttons'>
      <Button 
         content='Show All'
         filterElementsClick={filterElementsClick}
      />
      <Button 
         content='Show Incomes'
         filterElementsClick={filterElementsClick}
      />
      <Button 
         content='Show Expenses'
         filterElementsClick={filterElementsClick}      
      />
   </div>
)

const Button = ({content, filterElementsClick}) => (
   <button onClick={() => filterElementsClick(content)} className='filter-buttons__button'>{content}</button>
)

const ListElement = (props) => {

   const style = props.type === 'Add Income' ? {
      color: '#00FF00',
      backgroundColor: '#ccffcc',
      border: '1px solid #00FF00'
   } : { color: '#E6004C', backgroundColor: '#ffb3cc', border: '1px solid #E6004C'};

   return(
      <li style={style}>
         <strong>{props.type}:</strong>
         <strong style={{color: 'black'}}>{props.name}</strong>
         <i style={{fontWeight: 'bold'}}>{props.value} PLN</i>
      </li>
   )
}

ReactDOM.render(<App/>, document.getElementById('root'));