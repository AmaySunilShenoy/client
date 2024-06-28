import React, { useState } from 'react'
import { MuiTelInput } from 'mui-tel-input'
import parsePhoneNumber from 'libphonenumber-js'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "./ui/select"
import AddressAutocomplete from 'mui-address-autocomplete'
import { fourLeggedMammals } from '../utils/dataSet'
import { useToast } from './ui/use-toast'
import { Toaster }from './ui/toaster'
import { Separator } from "./ui/separator"
import { Transition } from '@headlessui/react'
import useDebounce from '../utils/useDebounce'


import { FloatingLabel, FloatingLabelInput } from './ui/floatInput'

const CustomTransition  = ({ predicate, children }) =>{ 
    return(
        <Transition
        className="mx-auto my-2 space-y-4"
        show={predicate}
        enter="transition-all ease-in-out duration-[1000ms] delay-[400ms]"
        enterFrom="opacity-0 translate-y-6"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        >
            {children}
        </Transition>
    )
}


const Form = () => {
    
    const [ showFullAddress, setShowFullAddress ] = useState(false)

    const [errors, setErrors] = useState({
        phone: false,
        phoneRequired: false,
        fname: false,
        lname: false,
        address: false,
        favNumber: false,
        favMammal: false,        
    })
    
    const [form, setForm] = useState({
        fname: '',
        lname: '',
        countryCode: '',
        phone: '',
        address: '',
        postcode: '',
        city: '',
        favNumber: 0,
        favMammal: '',
    });

    const { toast } = useToast()

    const phoneDebounce = () => {
        if (!form.phone) {
           return
        }
        if (!validatePhoneNumber()) {
            setErrors({
                ...errors,
                phone: true,
            });
        } else {
            setErrors({
                ...errors,
                phone: false,
            });
        }
    }

    const firstNameDebounce = () => {
        if (!form.fname) {
            return
        }
        if (!validateName(form.fname)) {  
            setErrors({
                ...errors,
                fname: true,
            });
        } else {
            setErrors({
                ...errors,
                fname: false,
            });
        }
    }

    const lastNameDebounce = () => {
        if (!form.lname) {
            return
        }
        if (!validateName(form.lname)) {
            setErrors({
                ...errors,
                lname: true,
            });
        } else {
            setErrors({
                ...errors,
                lname: false,
            });
        }
    }

    const favNumberDebounce = () => {
        if (!form.favNumber) {
            return
        }

        if (form.favNumber > 0 && form.favNumber < 100) {

            setErrors({
                ...errors,
                favNumber: false,
            });
        } else {
            setErrors({
                ...errors,
                favNumber: true,
            });
        }
    }

    useDebounce(phoneDebounce, [form.phone], 600)
    useDebounce(firstNameDebounce, [form.fname], 600)
    useDebounce(lastNameDebounce, [form.lname], 600)
    useDebounce(favNumberDebounce, [form.favNumber], 600)


    function capitalizeWords(str) {
        return str.split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
    }

    // animals
    const handlePhoneChange = (newValue, info) => {

        setForm({
            ...form,
            countryCode: info.countryCode,
            phone: newValue,
        });

        if (newValue) {
            setHasTypedPhone(true)
        }

        
    };

    const [ hasTypedPhone, setHasTypedPhone ] = useState(false)

    const handleChange = (e) => {
        console.log(e);
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const changeNumber = (e) => {
        setForm({
            ...form,
            favNumber: parseInt(e.target.value),
        });
    }

    const handleValidAddress = (e) => {
        if (!form.address ) {
            return false;
        }
    }

    const handleAddressChange = (value) => {
        console.log('address change', value)

        if (!value) {
            setForm({
                ...form,
                address: '',
                postcode: '',
                city: '',
            });
            setShowFullAddress(false);
        } else {
        setForm({
        ...form,
        address: value?.components.street_number?.[0]?.long_name && value?.components.route?.[0]?.long_name ? (value?.components.street_number?.[0]?.long_name  + ' ' + value?.components.route?.[0]?.long_name) : value.description,
        postcode: value?.components?.postal_code?.[0]?.long_name,
        city: value?.components?.locality?.[0]?.long_name,
        });
        setShowFullAddress(true);
        
    }
}

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z ]+$/;
        if (!name.match(nameRegex)) {
            return false;
        }
        return true;
    }

        

    const validateFullName = () => {
        const fullnameRegex = /^[a-zA-Z ]+$/;
            if (!form.fname.match(fullnameRegex)) {
                return false
            } else if (!form.lname.match(fullnameRegex)) {
                return false;
            } else {
                return true;
            }
    }

    const validatePhoneNumber = () => {

        const phoneNumber = parsePhoneNumber(form.phone, form.countryCode)
        if (!phoneNumber) {
            return false;                
        }

        if(!(phoneNumber.country === form.countryCode &&
            phoneNumber.isPossible() === true &&
            phoneNumber.isValid() === true)){
                return false;
            }
            return true;
    }


    const handleSubmit = (e) => { 
        e.preventDefault()
        console.log('submitting form')
        if (!validatePhoneNumber()) {
            return;
        }
       
        if (!validateFullName()) {
            return;
        }
        
        fetch('http://localhost:8000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
        .then((res) => {
            if (res.ok) {
                toast({
                    title: 'Success',
                    description: 'User saved!',
                   variant: 'success',
                });
                setForm({
                    fname: '',
                    lname: '',
                    countryCode: '',
                    phone: '',
                    address: '',
                    postcode: '',
                    city: '',
                    favNumber: 0,
                    favMammal: '',
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Error saving user',
                    variant: 'destructive',
                });
            }
        })
    }


  return (
        <div className="w-full">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                <h2 className="text-xl font-bold">User info</h2>

                {/* Name */}
                <div className="flex flex-row w-full">
                    <div className="flex w-full gap-x-3 ">
                        <div className=" relative flex flex-1 flex-col space-y-1.5">
                            <FloatingLabelInput 
                            id="fname" 
                            label="First Name"
                            className="w-full"
                            value={form.fname}
                            onChange={handleChange}
                             /> 
                             {
                                errors.fname && <p className="text-red-500 text-xs font-bold">Invalid first name (Only letters are allowed)</p>
                            }
                        </div>
                        <div className="flex flex-col flex-1 space-y-1.5">
                        <FloatingLabelInput 
                            id="lname" 
                            label="Last Name"
                            className="w-full"
                            value={form.lname}
                            onChange={handleChange}
                             /> 
                             {
                                errors.lname && <p className="text-red-500 text-xs font-bold">Invalid last name (Only letters are allowed)</p>
                            }
                            
                        </div>
                    </div>
                </div>


                <CustomTransition predicate={validateFullName()}>

                    <div className='w-full'>
                        <Separator />
                        <h3 className="text-lg font-bold">More about you</h3>
                        {/* phone number */}
                        
                        <div className="relative flex flex-col space-y-1.5">
                        <FloatingLabel htmlFor="phone">Phone Number</FloatingLabel> 

                            <MuiTelInput defaultCountry='IN' value={form.phone} onChange={handlePhoneChange}/>
                            {
                                errors.phone && <p className="text-red-500 text-xs font-bold">Invalid phone number</p>
                            }
                            {
                                !errors.phone && hasTypedPhone && errors.phoneRequired && <p className="text-red-500 text-xs font-bold">Phone number is required</p>
                            }
                        </div>

                    <AddressAutocomplete
                        apiKey="AIzaSyCLKzHme124wzK_mEOVI8Gbs0Ia1V7M1VA"
                        label="Address"
                        className='h-fit'
                        fields={['geometry']} // fields will always contain address_components and formatted_address, no need to repeat them
                        value={form.address}
                        onChange={(_, value) => {
                            handleAddressChange(value);
                        }}
                        />

                        {
                            showFullAddress && 

                        <div className='flex items-center'>
                            {form.postcode && 
                                <div className="flex flex-col space-y-1.5">
                                    <FloatingLabelInput 
                                        id="postcode"
                                        type="text"
                                        label="Postcode"
                                        defaultValue=""
                                        className="col-span-3"
                                        name="postcode"
                                        value={form.postcode}
                                        onChange={handleChange}
                                        readOnly
                                    /> 
                                </div> }
                                {form.city &&
                                <div className="flex flex-col space-y-1.5 mx-auto">
                                    <FloatingLabelInput 
                                        id="city"
                                        type="text"
                                        label="City"
                                        defaultValue=""
                                        className="col-span-3"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        readOnly
                                     /> 
                                </div> }
                        </div>
                        }
                    </div>
                </CustomTransition>

                <CustomTransition predicate={validatePhoneNumber() && validateFullName() && showFullAddress}>
                 <div className='w-full'>
                    <Separator />

                    {/* ------------------------------ Faves ----------------------------- */}
                    <h2 className="text-xl font-bold">Favourites</h2>
                    
                    {/* Fave Number */}

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1.5">
                        <FloatingLabelInput 
                            id="favenumber"
                            type="number"
                            name="favNumber"
                            label="Favourite Number"
                            className="w-[280px]"
                            value={form.favNumber}
                            onChange={changeNumber}
                            min={0} 
                            max={100}
                             /> 
                             {
                                errors.favNumber && <p className="text-red-500 text-xs font-bold">Number must be between 0 and 100 (Sorry thats the rules)</p>
                            }
                        </div>

                    {/* mammal */}
                    <div className="relative flex flex-col space-y-1.5">
                        <FloatingLabel htmlFor="favmammal">Favourite 4 legged animal </FloatingLabel> 
                        <Select value={form.favMammal} onValueChange={(val) => setForm({...form, favMammal: val})}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Select your favourite " />
                            </SelectTrigger>
                            <SelectContent>
                             
                                {
                                    fourLeggedMammals.map((mammal, index) => {
                                        return <SelectItem key={index} value={mammal.name}>{capitalizeWords(mammal.name)}</SelectItem>
                                    })
                                }
                            
                                {/* </SelectGroup> */}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                </div>
                </CustomTransition>

                <CustomTransition predicate={validatePhoneNumber() && validateFullName() && showFullAddress && form.favNumber && form.favMammal}>
                    <div className='w-fit'>
                        <Separator />
                        <Button type="submit">Submit</Button>
                    </div>
                </CustomTransition>

                
            </form>
        <Toaster />
    </div>
  )

}
export default Form
