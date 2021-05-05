import "antd/dist/antd.css";
import "moment/locale/ru";
import "../App.css";
import axios from "axios";
import {  url} from "../data/data.js";
import {Button,  Form,  message, Checkbox, Upload } from "antd";
import React, { useState } from "react";
import UploadFile from "../components/upload";


const AddAnketa = ({text}) => {
  // let history = useHistory()
  // Токен
  const storedJwt = localStorage.getItem("token")
  // // Стейты для копирования файлов 
  // const [fileImage, setFileImage] = useState([])
  const [fields, setFields] = useState()
  const [spin, setSpin] = useState(true); 
  const [form] = Form.useForm()
  
 //отправляем анкету на сервер
 function ResiveAddAnkete(values) {
   console.log(text.length)
  if (text.length !== 31) {
    axios({
      method: "PATCH",
      url: `${url}update/additional`,
      data: values,
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Credentials,Access-Control-Allow-Origin,Access-Control-Allow-Method,Content-Type,Accept,Authorization",
        "Authorization": `Bearer ${storedJwt}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Method": "PATCH",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",          
        "Accept": "application/json",
      }
    })
    .then(res => {
      message.info({ content: "Ваша анкета изменена ", duration: 2 })
    })
    .catch(error => message.error({ content: "Ошибка записи. Попробуйте ешё раз", duration: 2 }))
  } else {
    axios({
      method: "POST",
      url: `${url}additional`,
      data: values,
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Credentials,Access-Control-Allow-Origin,Access-Control-Allow-Method,Content-Type,Accept,Authorization",
        "Authorization": `Bearer ${storedJwt}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Method": "PATCH",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",          
        "Accept": "application/json",
      }
    })
      .then(res => {
        message.info({ content: "Ваша анкета отправлена на модерацию", duration: 2 })
      })
      .catch(error => {       
        console.log(error.response);
        if (error.response.status  !== 412) {
          for (const i of error.response.data.errors) {         
            message.error({ content: i.message, duration: 4,style: {
              marginTop: "20vh",fontSize: 30} 
            });
          }
        } else {
          message.warn({ content: `${error.response.data}`, duration: 4 ,style: {
            marginTop: "20vh",fontSize: 30} 
          })
        }        
      })
      .finally(() => setSpin(true))
    console.log(values);
  }

}  
  const beforeUploadAdd = (file, b) => {
    if (file.size > 2000000) {
      message.error({ content: ` Размер ${file.name} больше 2 мб !`, duration: 2 });
    } else {
      var reader = new FileReader();
      reader.onloadend = function () { setFields([{ name: b, value: reader.result }]) };
      reader.readAsDataURL(file);      
    } 
    return (file.type === "image/jpeg" || file.size > 2000000) ? true : Upload.LIST_IGNORE;
  }
  
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
      lg: { span: 10 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
      lg: { span: 14 }
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
        span: 14,
        offset: 10,
      }
    },
  };

  return (
    <Form 
      layout="horizontal"
      form={form}
      {...formItemLayout}
      fields={fields}
      initialValues={{ remember: true }}
      onFinish={ResiveAddAnkete}
    > 
      <h3 style={{margin:"20px 0"}}><b>{text}</b></h3>      
      <UploadFile 
        label="Фото всех страниц медкнижки" 
        name="medicalBook" 
        beforeUploadAdd={beforeUploadAdd}
        setFields={setFields}
      />
       <UploadFile 
        label="Фото военного билета" 
        name="militaryId" 
        beforeUploadAdd={beforeUploadAdd}
        setFields={setFields}
      />
      <UploadFile 
        label="Заключение профпатолога" 
        name="conclusionOccupationalPathologist" 
        beforeUploadAdd={beforeUploadAdd}
        setFields={setFields}
      />
      <UploadFile 
        label="Заключение нарколога" 
        name="conclusionNarcologist" 
        beforeUploadAdd={beforeUploadAdd}
        setFields={setFields}
      />
      <UploadFile 
        label="Заключение психиатра" 
        name="conclusionPsychiatrist" 
        beforeUploadAdd={beforeUploadAdd}
        setFields={setFields}
      />
      <UploadFile 
        label="Ваше фото" 
        name="userPhoto" 
        beforeUploadAdd={beforeUploadAdd}
        setFields={setFields}
      />      
      <span className="addAnketaText" >
        <b>Фото</b> в анфас, белый медицинский халат,
        лицо хорошо видно , голова/плечи не срезаны - силуэт хорошо виден
        полностью, размер минимум 400*400 пикселей, не более 2мб,
        цветная фотография
      </span>      
      <Form.Item {...tailFormItemLayout}
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error("Необходимо принять соглашение")),
              },
            ]}
          >
            <Checkbox>Согласен на обработку персональных данных</Checkbox>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
          {spin ? <Button type="primary" htmlType="submit" style={{width: "50%"}}>
            Сохранить
          </Button>:
          <Button type="primary" loading style={{width: "50%"}}>
            Сохранение
          </Button>}
        </Form.Item>
  </Form>)
}
export default AddAnketa;