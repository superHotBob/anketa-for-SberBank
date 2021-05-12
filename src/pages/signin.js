import "../App.css";
import axios from "axios";
import "antd/dist/antd.css";
import { useState } from "react";
import InputMask from 'react-input-mask';
import { urltoken } from "../data/data.js";
import { Link, useHistory } from "react-router-dom";
import { Button, Input, Form, message } from "antd";

function Sign() {
  let history = useHistory()
  const [form] = Form.useForm()
  const [phone, setPhone] = useState("")
  const [snils, setSnils] = useState("")
  
  function Authorization() {
    axios({
      method: "post",
      url: urltoken,
      data: { username: 7 + phone.replace(/[^0-9]/g, ""), password: snils.replace(/[^0-9]/g, "")}
    })
      .then(res => {        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        history.push('/editanketa');
      })
      .catch(() => {
        message.warn({ content: "Проверьте корректность введенных данных и попробуйте еще раз.",
          duration:4,style:{marginTop: "20vh"} 
        });       
        setPhone("");
        setSnils("");
      })
  }
  const onChangePhone = e => {
    const { value } = e.target; 
    setPhone(value);     
  };
  const onChangeSnils = e => {
    const { value } = e.target;   
    setSnils(value);      
  };
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      lg: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      lg: { span: 18 }
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
      lg: {
        span: 16,
        offset: 6,
      }
    },
  };
  return (
    <div className="App">
      <Link to="/" className="App-header" title="на главную">
        <header className="App-header" />
      </Link>
      <p>
        После авторизации вам будет доступно изменение данных, заполненных на
        первом этапе. А также ряд полей которые были изначально недоступны.
      </p>   
        <Form layout="horizontal" onFinish={Authorization} form={form} {...formItemLayout}>
          <Form.Item label="* Телефон" >
            <InputMask          
              onChange={onChangePhone} 
              value={phone}
              required
              mask="(999)-(999)-(99)-(99)" 
              maskChar="X"
            >
              {(inputProps) => <Input {...inputProps}                  
                placeholder="(XXX)-(XXX)-(XX)-(XX)"
                title="10 цифр без пробелов"            
                addonBefore="+7"             
                pattern="[0-9\(\)]{5}-[0-9\(\)]{5}-[0-9\(\)]{4}-[0-9\(\)]{4}"            
              />}
            </InputMask>
          </Form.Item>
          <Form.Item label="* Снилс" >
            <InputMask  
              alwaysShowMask="false" 
              onChange={onChangeSnils} 
              value={snils} 
              mask="999-999-999 99" 
              maskChar="X"
            >
              {(inputProps)=><Input.Password  allowClear
                required            
                {...inputProps}
                placeholder="XXX-XXX-XXX XX"
                title="11 цифр без пробелов"             
                type="password"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{3} [0-9]{2}"              
              />}
            </InputMask>     
          </Form.Item>
         
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Войти
            </Button>
          </Form.Item>
        </Form>
     
    </div>
  );
}


export default Sign;