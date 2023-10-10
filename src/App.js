import { useState } from "react";
import "./index.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [selectFriends, setSelectFriends] = useState(null);
  const [friends, setFriends] = useState(initialFriends);

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectFriends.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriends(null);
  }

  function addFriendhandler(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriends(false);
  }
  function removeFriendhandler(id) {
    setFriends((friends) => friends.filter((friend) => friend.id !== id));
  }

  function showFriendhandler() {
    setShowAddFriends((show) => !show);
  }

  function selectFriend(friend) {
    setSelectFriends(friend === selectFriends ? null : friend);
    setShowAddFriends(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        {friends.map((f) => (
          <FriendsList
            friends={f}
            key={f.id}
            ondelte={removeFriendhandler}
            onSelect={selectFriend}
            selectFriends={selectFriends}
          />
        ))}
        {showAddFriends && <FormAddFriend add={addFriendhandler} />}
        <Button onclick={showFriendhandler}>
          {showAddFriends ? "close" : "Add Friends"}
        </Button>
      </div>
      {selectFriends && (
        <SplitBill
          selectFriends={selectFriends}
          handleSplitBill={handleSplitBill}
          key={selectFriends.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, ondelte, onSelect, selectFriends }) {
  const isSelect = selectFriends?.id === friends.id;
  return (
    <ul>
      <li className={isSelect ? "selected" : ""}>
        <img src={friends.image} alt={friends.name} />
        {friends.name}
        <button
          className="close-button"
          aria-label="Close alert"
          type="button"
          data-close
          onClick={() => ondelte(friends.id)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {friends.balance < 0 && (
          <p className="red">
            you owe {friends.name} {Math.abs(friends.balance) + "₹"}
          </p>
        )}
        {friends.balance > 0 && (
          <p className="green">
            {friends.name} owe you {Math.abs(friends.balance) + "₹"}
          </p>
        )}
        {friends.balance === 0 && <p>you and {friends.name} is even</p>}
        <Button onclick={() => onSelect(friends)}>
          {isSelect ? "close" : "select"}
        </Button>
      </li>
    </ul>
  );
}

function FormAddFriend({ add }) {
  const [name, setName] = useState(null);
  const [url, setUrl] = useState("https://i.pravatar.cc/48");

  function handelSubmit(e) {
    if (!name || !setName) return false;
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${url}?u=${id}`,
      balance: 0,
      id: id,
    };
    add(newFriend);

    setName("");
    setUrl("https://i.pravatar.cc/48");
  }

  return (
    <div>
      <form className="form-add-friend" onSubmit={handelSubmit}>
        <label>👯Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>🖼️Image URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </div>
  );
}

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function SplitBill({ selectFriends, handleSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpenses, setUserExpenses] = useState("");
  const FriendExpenses = bill ? bill - userExpenses : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handelSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpenses) return;
    handleSplitBill(whoIsPaying === "user" ? FriendExpenses : -userExpenses);
  }
  return (
    <form className="form-split-bill" onSubmit={handelSubmit}>
      <h2>spil a bill with {selectFriends.name}</h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🕴️Your expense</label>
      <input
        type="text"
        value={userExpenses}
        onChange={(e) =>
          setUserExpenses(
            Number(e.target.value) > bill
              ? userExpenses
              : Number(e.target.value)
          )
        }
      />
      <label>👯 {selectFriends.name}'s expense</label>
      <input type="text" disabled value={FriendExpenses} />
      <label>🤑Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectFriends.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

export default App;
