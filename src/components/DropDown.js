import { useState } from "react";
import Select from "react-select";
import useGetAll from "./hooks/useGetAll";



// const CategoryDD = (props) => {
//   const [isClearable, setIsClearable] = useState(false);
//   const [response] = useGetAll("DropDown/GetDropDownList?type=Category"+ "&paramId=" + props.paramId);
//   const arr = response.data.filter((item) => item.value === props.selected);

//   return (
//     <Select
//       {...props}
//       value={arr[0]}
//       options={response.data}
//       isClearable={() => setIsClearable(!isClearable)}
//       placeholder="Select Category"
//     />
//   );
// };

const CategoryDD = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Category");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      value={arr[0]}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Category"
    />
  );
};

const ProductGroup = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=ProductGroup");

  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Select Product Group"
    />
  );
};

const Product = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Product");

  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Select Product"
    />
  );
};

const Dosage = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Dosage");
  console.log(response);
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Select Dosage"
    />
  );
};
const Generics = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Generics");
  console.log(response);
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Select Generics"
    />
  );
};
const Manufacturer = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Manufacturer");
  console.log(response);
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Select Manufacturer"
    />
  );
};
const Strenth = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Strenth");
  console.log(response);
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Select Strenth"
    />
  );
};
const UserType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=UserType");
  console.log(response);
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Select User Type"
    />
  );
};
const Brand = (props) => {
  console.log(props);
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Brand");
 
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      options={response.data}
      placeholder="Product"
    />
  );
};
const OriginCountry = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=OriginCountry");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Sl Origin"
    />
  );
};
const Supplier = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Supplier");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Supplier"
    />
  );
};

const Unit = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Unit");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Unit"
    />
  );
};


const AccountType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=AccountType");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Account type"
    />
  );
};


const ParentAccount = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=ParentAccount");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select parent account"
    />
  );
};


const Company = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetCompanyDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};
const Country = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Country");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};
const Store = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Store");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};


const Role = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Role");
  // response.data.forEach(function (item) {
  //   item.value = item.ValueString;
  // });
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Role"
    />
  );
};


export {
  ProductGroup,
  Product,
  Company,
  ParentAccount,
  AccountType,
  Supplier,
  Unit,
  Country,
  Store,
  Role,
  Dosage,
  Strenth,
  Generics,
  Brand,
  Manufacturer,
  UserType,
  CategoryDD,
  OriginCountry
};
