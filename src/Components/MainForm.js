import { useState } from "react";
import { init, send } from "@emailjs/browser";
init("s8Ep-G_ANfHn-JDOh");

const MainForm = (props) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [food, setFood] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const [mobileIsValid, setMobileIsValid] = useState(true);
  const [addressIsValid, setAddressIsValid] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const mobileInputHandler = (e) => {
    const text = e.target.value;
    if (text.length > 0 && text.length <= 10) {
      setMobileIsValid(true);
    } else {
      setMobileIsValid(false);
    }
    setMobile(text);
  };

  const addressInputHandler = (e) => {
    const text = e.target.value;
    if (text.length > 0) {
      setAddressIsValid(true);
    } else {
      setAddressIsValid(false);
    }
    setAddress(text);
  };

  let content;

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const fieldsNotEmpty = mobile.length > 0 && address.length > 0;
    const fieldsValid = mobileIsValid && addressIsValid;
    if (fieldsNotEmpty && fieldsValid) {
      const data = {
        name,
        mobile,
        food,
        address,
        note,
      };
      const msg = `Food Details: \n
                  Name: ${name} \n
                  Mobile: ${mobile} \n
                  Food Items: ${food} \n
                  Address: ${address} \n
                  Comments: ${note}`;
      setSubmitting(true);
      fetch("https://giveaway-23069-default-rtdb.firebaseio.com/orders.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.status === 200) {
            console.log("data sent");
            setSubmitting(false);
            setName("");
            setMobile("");
            setFood("");
            setAddress("");
            setNote("");
          }
          send(
            "service_8yplb3p",
            "template_q3mitav",
            {
              to_name: "Ankit Bhaskar",
              from_name: `${name}`,
              name: name,
              mobile: mobile,
              food: food,
              address: address,
              note: note,
            },
            "s8Ep-G_ANfHn-JDOh"
          ).then(
            (result) => {
              console.log("email status:", result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
        })
        .catch(() => {
          content = (
            <div className="submitting-text">
              <p>Something Went Wrong...</p>
            </div>
          );
        });
    }
  };
  content = (
    <div className="content">
      <form className="main-form" onSubmit={formSubmitHandler}>
        <h2 className="form-heading">Beat The Hunger</h2>
        <div className="input-form">
          {/* name */}
          <div className="form-row">
            <label>Name:</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Your Name"
            />
          </div>

          {/* mobile */}
          <div className="form-row">
            <div className="label-row">
              <label>
                Mobile<span>*</span>:
              </label>
              {!mobileIsValid && (
                <p className="error-text">Enter Valid Mobile Number</p>
              )}
            </div>
            <input
              type="tel"
              pattern="[0-9]{10}"
              placeholder="Mobile (10 digits)"
              value={mobile}
              onChange={mobileInputHandler}
              required
            />
          </div>

          {/* Food details */}
          <div className="form-row">
            <label>Food:</label>
            <input
              type="text"
              placeholder="Food Items"
              value={food}
              onChange={(e) => setFood(e.target.value)}
            />
          </div>
          {/* Address */}
          <div className="form-row">
            <div className="label-row">
              <label>
                Address<span>*</span>:
              </label>
              {!addressIsValid && (
                <p className="error-text">Enter Valid Address</p>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter Your Address"
              value={address}
              onChange={addressInputHandler}
              required
            />
          </div>

          {/* Comments */}
          <div className="form-row">
            <label>Comments:</label>
            <input
              type="text"
              placeholder="Notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="form-row">
            <input className="form-submit-btn" type="Submit" />
          </div>
        </div>
      </form>
    </div>
  );

  const submittingText = (
    <div className="submitting-text">
      <p>Submitting, Please wait...</p>
    </div>
  );
  const contentToShow = submitting ? submittingText : content;

  return <section className="content-container">{contentToShow}</section>;
};

export default MainForm;
