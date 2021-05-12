import "../App.css";
import axios from "axios";
import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/ru";
import { array , url} from "../data/data.js";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button, Input, Form, DatePicker,
  Select, InputNumber, Checkbox, Upload, message
} from "antd";
import React, { useState, useEffect } from "react";
import InputMask from 'react-input-mask';
import TextArea from "antd/lib/input/TextArea";
import UploadFile from "../components/upload/index.js";
import locale from "antd/es/date-picker/locale/ru_RU.js";

const { Option } = Select;
const dateFormat = "YYYY-MM-DD";
function NewAnketa({ anketa }) {

  const [form] = Form.useForm();
  const [spin, setSpin] = useState(true); 
  const [fields, setFields] = useState();
  const YEAR = (new Date()).getFullYear();

  //предварительная обработка image  Diplom и image cerificate MO
  const beforeUploadDiplom = (file, b) => {
    if (file.size > 2000000) {
      message.error({ content: ` Размер ${file.name} больше 2 мб !`, duration: 2 });
    } else {
      const reader = new FileReader();
      reader.onloadend = function () { setFields([{ name: b, value: reader.result }]); };
      reader.readAsDataURL(file);
    }
    return (file.type === "image/jpeg" || file.size > 2000000) ? true : Upload.LIST_IGNORE;
  }
  // const onRemoveDiplom = (file, b) => {
  //   const index = fileDiplom.indexOf(file);
  //   const newFileList = fileDiplom.slice();
  //   newFileList.splice(index, 1);
  //   setFileDiplom(newFileList);
  //   setFields([{ name: b, value: "" }])
  // }
  // Отправка курсов
  const [fotoCurses, setFotoCurses] = useState([])
  
  const beforeUploadCurces = (file) => {   
    if (file.type !== "image/jpeg") {
      message.error({ content: `${file.name} не  jpg  файл !`, duration: 2 });
      // onRemoveDiplom(file, b);
    } else if (file.size > 2000000) {
      message.error({ content: ` Размер ${file.name} больше 2 мб !`, duration: 2 });
    } else {
      const reader = new FileReader();
      reader.onloadend = function () {
        setFotoCurses([...fotoCurses, { "image": reader.result }]);        
      };
      reader.readAsDataURL(file);
    }
    return  file.size < 2000000 ? true : Upload.LIST_IGNORE;
  }
  useEffect(() => {
    setFields([{ name: ["questionnaire", "refresherCoursesImages"], value: fotoCurses }]);
  }, [fotoCurses])

  // Отправка сертификатов
  const [fotoCertif, setFotoCertif] = useState([])
  
  const beforeUploadCertif = (file) => {  
    if (file.size > 2000000) {
      message.error({ content: ` Размер ${file.name} больше 2 мб !`, duration: 2 });
    } else {
      const reader = new FileReader();     
      reader.onloadend = function () {
        setFotoCertif([...fotoCertif, { "image": reader.result }]);        
      };
      reader.readAsDataURL(file);
    }
    return  file.size < 2000000 ? true : Upload.LIST_IGNORE;
  }
  useEffect(() => {
    setFields([{ name: ["questionnaire", "validCertificatesImages"], value: fotoCertif }]);
    
  }, [fotoCertif])

  //Стейты для копирования файлов 
  const [fileImage, setFileImage] = useState([])
  //пропсы для отправки файла
  const propImage = {
    onRemove: file => {
      const index = fileImage.indexOf(file);
      const newFileList = fileImage.slice();
      newFileList.splice(index, 1);
      setFileImage(newFileList);
    }
  } 
  //список анкет для AXIOS
  const anketaSelect = ["c3", "clinic-partner", "mo"]
  //отправляем анкету на сервер
  function ResiveAnkete(values) {
    const imageCourses = values.questionnaire.refresherCoursesImages;
    const s = values.questionnaire.validCertificates.dateEnd;
    let DoB = (
      values.questionnaire.dob ? values.questionnaire.dob.format(dateFormat): ""
    );
    let DateEndCertif = (
      s ? s.format(dateFormat) : ""
    );
    let ImageCourses = (
      imageCourses ? values.questionnaire.refresherCoursesImages : []
    );
    values.user.phone = Number("7"+ values.user.phone.replace(/[^0-9]/g, ""));
    values.user.insuranceNumber = Number(values.user.insuranceNumber.replace(/[^0-9]/g, ""));
    values.questionnaire.dob = DoB;
    values.questionnaire.validCertificates.dateEnd = DateEndCertif; 
    values.questionnaire.refresherCoursesImages = ImageCourses;
    setSpin(false);
    axios({
      method: "post",
      headers: {
        "Access-Control-Allow-Headers": "Access-Control-Allow-Origin,Access-Control-Allow-Method,Content-Type,Accept",        
        "Access-Control-Allow-Origin": "http://localhost:3000",
        // "Access-Control-Allow-Method": "POST",
        // "Content-Type": "application/json",
        // "Accept": "application/json",
      },
      url: `${url}${anketaSelect[Number(anketa) - 1]}`,
      data: values
    })
      .then(() => {       
        message.success({ content: "Ваша анкета отправлена на модерацию", duration: 4,style: {
          marginTop: "20vh",fontSize: 20 } })
      })
      .catch(error => {       
        console.log(error);
        if (error.response.status  === 500) {
          message.warn({ content: 'Ошибка сервера. Попробуйте ещё раз', duration: 4 ,style: {
            marginTop: "20vh",fontSize: 20} 
          })       
        } else if (error.response.status  !== 412) {
          for (const i of error.response.data.errors) {         
            message.error({ content: i.message, duration: 4,style: {
              marginTop: "20vh",fontSize: 20} 
            });
          }
        } else {
          message.warn({ content: `${error.response.data}`, duration: 4 ,style: {
            marginTop: "20vh",fontSize: 20} 
          })
        }        
      })
      .finally(() => setSpin(true))
    console.log(values);
  }
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf("year").subtract(18, "years");
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
    <div>
      <Form
        layout="horizontal"
        form={form}
        scrollToFirstError="true"
        {...formItemLayout}
        fields={fields}
        initialValues={{ remember: true }}
        onFinish={ResiveAnkete}
      >
        {/* <p style={{ textAlign: "left", color: "red" }}>* обязательные для заполнения поля</p> */}
        {anketa !== 1 && <>
          <Form.Item label="Название МО" name={["questionnaire", "moName"]}
            rules={[{ required: true, message: "Введите название МО" }]}
          >
            <Input             
              placeholder="Название МО"
              maxLength={255}              
            />
          </Form.Item>
          <p>Далее поля связанные с врачом</p>
        </>
        }
        <h3><b>Общая информация о враче</b></h3>
        <Form.Item label="ФИО"
          layout="inline" name={[]}
          rules={[{ required: true ,message:""}]}
          style={{ height: "auto",marginBottom: 0}}          
        >
          <Form.Item name={["user", "fullName", "last"]}
            style={{ width: "30%", display: "inline-block" }}            
            rules={[{ required: true, message: "Фамилия" }]}
          >
            <Input
              title="русскими буквами"
              required
              placeholder="Фамилия"
              pattern="[а-яА-ЯёЁ\-]{1,40}"
            />
          </Form.Item>
          <Form.Item name={["user", "fullName", "first"]} 
            style={{ width: "30%", display: "inline-block", margin: "0 5%" }}
            rules={[{required: true, message: "Имя"}]}
          >
            <Input
              placeholder="Имя"
              required
              title="русскими буквами"
              pattern="[а-яА-ЯёЁ\-\s?]{2,40}"
            />
          </Form.Item>
          <Form.Item name={["user", "fullName", "middle"]} 
            style={{ width: "30%", display: "inline-block" }}
            rules={[{ required: true, message: "Отчество" }]}
          >
            <Input
              required
              title="русскими буквами"
              placeholder="Отчество"
              pattern="[а-яА-ЯёЁ]{3,40}"
            />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Email" name={["user", "email"]}
          rules={[{ required: true, message: "Введите валидный email" }]}
        >
          <Input
            placeholder="example@gmail.com"
            required
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          />
        </Form.Item>
        <Form.Item label="Телефон" name={["user", "phone"]}
          rules={[{
            required: true,
            message: "Введите ваш телефон в формате: 10 цифр без пробелов и тире"
          }]}
        >
          <InputMask          
              // onChange={onChangePhone} 
              // value={phone}
              
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
          {/* <Input
            placeholder="XXXXXXXXXX"
            title="10 цифр без пробелов и тире"
            maxLength={10}            
            addonBefore="+7"
            pattern="[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}"
          /> */}
        </Form.Item>
        <Form.Item label="Снилс" name={["user", "insuranceNumber"]}
          rules={[{ required: true, message: "Введите ваш СНИЛС" }]}
        >
          <InputMask  
            
              // onChange={onChangeSnils} 
              // value={snils} 
            mask="999-999-999 99" 
            maskChar="X"
          >
            {(inputProps)=><Input.Password  allowClear
                        
                {...inputProps}
                placeholder="XXX-XXX-XXX XX"
                title="11 цифр без пробелов"             
                type="password"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{3} [0-9]{2}"              
              />
            }
          </InputMask>     
          {/* <Input.Password
            placeholder="ХХХХХХХХХХХ"
            maxLength={11}
            title="11 цифр без пробелов и тире"
            pattern="[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}"
          /> */}
        </Form.Item>
        <Form.Item label="Город проживания" name={["user", "city"]}
          rules={[{ required: true, message: "Введите город проживания" }]}
        >
          <Input
            title="русскими буквами"
            placeholder="Город проживания"
            pattern="[а-яА-ЯёЁ\-\s?]{1,255}"
          />
        </Form.Item>
        {anketa === 3 ?
          <Form.Item label=" Cпециальность" name={["questionnaire", "specialty"]}
            rules={[{ required: true, message: "Введите  специальность" }]}
          >
            <Select
              showSearch
              notFoundContent="Не найдена специальность"
              pattern="[а-яёА-ЯЁ-]{1,35}"
              placeholder="Выберите специальность"
            >
              { array.map(i => <Option key={i} value={i}>{i}</Option>) }
            </Select>
          </Form.Item> : ""}
        {anketa !== 3 ? 
          <Form.Item label="Дата рождения" name={["questionnaire", "dob"]}
            rules={[{ required: true, message: "Выберите дату рождения" }]}
          >      
            <DatePicker 
              placeholder="Дата рождения"
              format ={dateFormat}
              locale={locale}             
              disabledDate={disabledDate}
            />
          </Form.Item> : null
        }
        {anketa !== 3 ? <>
          <Form.Item label="Основная специальность" name={["questionnaire", "mainSpecialty"]}
            rules={[{ required: true, message: "Введите основную специальность" }]}
          >
            <Select
              showSearch
              notFoundContent="Не найдена специальность"
              pattern="[а-яА-ЯёЁ-\s]{1,35}"
              placeholder="Выберите специальность"
            >
              { array.map(i => <Option key={i} value={i}>{i}</Option>) }
            </Select>
          </Form.Item> 
          <Form.Item label="Дополнительная специальность" 
            name={["questionnaire", "additionalSpecialty"]}
          >
            <Input
              placeholder="Дополнительная специальность"
              pattern="[а-яА-ЯёЁ\-\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Специализация" name={["questionnaire", "specialization"]}>
            <Input
              pattern="[а-яА-ЯёЁ\,-.'\s?]{1,255}"
              title="На лечении каких болезней специализируется врач"
              placeholder="Специализация"
            />
          </Form.Item>
          <Form.Item label="Какой ведете прием"
            name={["questionnaire", "physicianAppointment", "type"]}
            rules={[{ required: true, message: "Выберите тип приема" }]}
          >
            <Select placeholder="Вид приема">
              <Option value={1}>Детский</Option>
              <Option value={2}>Взрослый</Option>
            </Select>
          </Form.Item>

          <Form.Item noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.questionnaire !== currentValues.questionnaire}
          >
            {({ getFieldValue }) =>
              getFieldValue(["questionnaire", "physicianAppointment", "type"]) === 1 ? (
                <Form.Item label="C какого возраста"
                  name={["questionnaire", "physicianAppointment", "patientAge"]}
                  rules={[{ required: true , message: "Введите возвраст"}]}
                >
                  <InputNumber
                    min={1}
                    defaultValue={10}
                    max={18}
                    placeholder="Возраст"
                    title="для детского приема"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </> : null}

        <Form.Item label="Год начала врачебной практики"
          name={["questionnaire", "startMedicalPractice"]}
          rules={[{ required: true, message: "Введите год" }]}
        >
          <InputNumber
            placeholder="Год"
            maxLength={4}
            min={1970}
            max={YEAR}
          />
        </Form.Item>
        <UploadFile
          label="Фото диплома"
          name="diploma"
          beforeUploadAdd={beforeUploadDiplom}
          setFields={setFields}
        />
        {anketa === 3 ? <>
          <h3><b>Действительный сертификат по специальности</b></h3>
          <Form.Item label="Специальность" 
            name={["questionnaire", "validCertificates", "specialization"]}
            rules={[{ required: true, message: "Введите сертификат" }]}
          >
            <Input
              placeholder="Специальность"
              pattern="[а-яА-ЯёЁ\,-'\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Дата окончания"
            name={["questionnaire", "validCertificates", "dateEnd"]}
            rules={[{ required: true,message:"Введите дату окончания" }]}
          >
            <DatePicker
              placeholder="Дата окончания"             
              format="YYYY-MM-DD" 
              locale={locale}              
            />
          </Form.Item>
        
          <UploadFile
            label="Фото сертификата"
            name="validCertificatesImage"
            beforeUploadAdd={beforeUploadDiplom}
            setFields={setFields}
          />
          <Form.Item label="Расписание работы" name={["questionnaire", "workSchedule"]}>
            <Input
              placeholder="Расписание работы"
              pattern="[а-я,А-Я0-9\-\s?]{1,}"
            />
          </Form.Item>  </>
          : null
        }
         
        {anketa !== 3 ? <>
          <h3><b>Базовое образование</b></h3>
          <Form.Item label="Год окончания"
            rules={[{ required: true, message: "Введите год окончания" }]}
            name={["questionnaire", "basicEducation", "yearStart"]}
          >
            <InputNumber
              placeholder="Год"
              maxLength={4}
              min={1970}
              max={2021}
            />
          </Form.Item>
          <Form.Item label="Название учреждения"
            rules={[{ required: true, message: "Введите название учреждения" }]}
            name={["questionnaire", "basicEducation", "institutionName"]}
          >
            <Input
              placeholder="Название учреждения"
              pattern="[а-яА-ЯЁё\,-'\s?]{1,15}"
            />
          </Form.Item>
          <Form.Item label="Специализация"
            rules={[{ required: true, message: "Введите специализацию" }]}
            name={["questionnaire", "basicEducation", "specialization"]}
          >
            <Input
              placeholder="Специализация"
              pattern="[а-яА-ЯЁё\,'-\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Город" name={["questionnaire", "basicEducation", "city"]}
            rules={[{ required: true, message: "Введите город" }]}
          >
            <Input
              placeholder="Город"
              pattern="[а-я-А-ЯёЁ\s]{1,25}"
            />
          </Form.Item>         
         
          <h3><b>Интернатура/Ординатура</b></h3>
          <Form.Item label="Год окончания"
            name={["questionnaire", "internshipTraineeship", "yearEnd"]}
          >
            <InputNumber
              placeholder="Год"
              maxLength={4}
              min={1970}
              max={YEAR}
            />
          </Form.Item>
          <Form.Item label="Название учреждения" name={["questionnaire", "internshipTraineeship", "institutionName"]}>
            <Input
              placeholder="Название учреждения"
              pattern="[\-\а-яА-ЯёЁ №\s]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Специализация" name={["questionnaire", "internshipTraineeship", "specialization"]}>
            <Input
              placeholder="Специализация"
              pattern="[а-яА-ЯёЁ]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Город" name={["questionnaire", "internshipTraineeship", "city"]}>
            <Input
              placeholder="Город"
              pattern="[\-\а-яА-ЯёЁ]{3,25}"
            />
          </Form.Item>
          <h3><b>Аспирантура/Докторантура</b></h3>
          <Form.Item label="Год окончания" name={["questionnaire", "graduateSchoolDoctorate", "yearEnd"]}>
            <InputNumber
              min={1970}
              placeholder="Год"
              maxLength={4}
              max={YEAR}
            />
          </Form.Item>
          <Form.Item label="Название учреждения" name={["questionnaire", "graduateSchoolDoctorate", "institutionName"]}>
            <Input
              placeholder="Название учреждения"
              pattern="[-а-яА-ЯёЁ\№\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Специализация" name={["questionnaire", "graduateSchoolDoctorate", "specialization"]}>
            <Input
              placeholder="Специализация"
              pattern="[а-яА-ЯёЁ\-,'\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Город" name={["questionnaire", "graduateSchoolDoctorate", "city"]}>
            <Input
              placeholder="Город"
              pattern="[-а-яА-ЯёЁ]{1,15}"
            />
          </Form.Item>
          <h3><b>Действующие сертификаты</b></h3>
          <Form.Item label="Сертификат" name={["questionnaire", "validCertificates", "specialization"]}
            rules={[{ required: true, message: "Добавить сертификат" }]}
          >
            <Input
              placeholder="Название сертификата"
              pattern="[а-яА-Я]{1,}"
            />
          </Form.Item>
          <Form.Item label="Дата окончания" name={["questionnaire", "validCertificates", "dateEnd"]}
            rules={[{ required: true, message: "Дата окончания" }]}
          >
            <DatePicker placeholder="Дата окончания"             
              format ={dateFormat}
              locale={locale}
            />
          </Form.Item>
          <Form.Item label="Фото сертификата" name={["questionnaire", "validCertificatesImages"]}
            rules={[{ required: true, message: "Добавить сертификат" }]}
          >
            <Input className="inputFoto" />
            <Upload {...propImage} status="done"
              accept="image/jpeg"
              beforeUpload={(e) => beforeUploadCertif(e, ["questionnaire", "validCertificatesImages", "image"])}
            >
              <Button><UploadOutlined />Выберите файл</Button>
            </Upload>
          </Form.Item>
          <h3><b>Курсы повышения квалификации, семинары, мастерклассы</b></h3>
          <Form.Item label="Год окончания" name={["questionnaire", "refresherCourses", "yearEnd"]}>
            <InputNumber
              placeholder="Год"
              pattern="[0-9]{4}"
              min={1970}
              max={YEAR}
              maxLength={4}
              minLength={4}
            />
          </Form.Item>
          <Form.Item label="Наименования курсов" name={["questionnaire", "refresherCourses", "courseName"]}>
            <Input
              placeholder="Наименование курсов"
              pattern="[0-9а-яА-ЯёЁ\-\'\uxxxx\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Наименование учреждения" 
            name={["questionnaire", "refresherCourses", "institutionName"]}>
            <Input
              placeholder="Наименование учреждения"
              pattern="[-а-яА-Я,0-9№\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Специальность" name={["questionnaire", "refresherCourses", "specialization"]}>
            <Input
              placeholder="Специальность"
              pattern="[а-яА-ЯёЁ\,\-\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Фото сертификата" name={["questionnaire", "refresherCoursesImages"]} >
            <Input className="inputFoto" />
            <Upload {...propImage} status="done"
              accept="image/jpeg"
              beforeUpload={(e) => beforeUploadCurces(e, ["questionnaire", "refresherCoursesImages"])}
            >
              <Button><UploadOutlined />Выберите файл</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Врачебная категория" name={["questionnaire", "medicalCategory"]}>
            <Input
              placeholder="Врачебная категория"
              pattern="[а-я\-,.\А-ЯёЁ]{1,25}"
            />
          </Form.Item>
          <Form.Item label="Ученая степень" name={["questionnaire", "academicDegree"]}>
            <Input
              placeholder="Ученая степень"
              pattern="[а-яА-ЯёЁ\,\-\]{1,255}"
            />
          </Form.Item>
          <Form.Item style={{ lineHeight: "16px" }}
            label="Членство в профессиональных организациях"
            name={["questionnaire", "tradeUnionMembership"]}
          >
            <Input
              placeholder="Наименование организации"
              pattern="[а-яА-ЯёЁ\-\,\s?]{1,255}"
            />
          </Form.Item>
          <Form.Item label="Опыт работы" name={["questionnaire", "experience"]}>
            <TextArea rows={7} showCount maxLength={1000}
              placeholder="Год начала, год окончания, наименование организации, специальность"
              pattern="[а-яА-ЯёЁ\,\-\s?]{1,1000}"
            />
          </Form.Item>
          <Form.Item label="Награды" name={["questionnaire", "awards"]}>
            <Input
              placeholder="Награды"
              pattern="[а-яА-ЯёЁ\,\-\s?]{1,1000}"
            />
          </Form.Item>
          <Form.Item label="Фиксированные достижения" name={["questionnaire", "fixedAchievements"]}>
            <Input
              placeholder="Фиксированные достижения"
              pattern="[а-яА-ЯёЁ\,\-\s?]{1,1000}"
            />
          </Form.Item>
          <Form.Item label="Научная деятельность" name={["questionnaire", "scientificActivity"]}>
            <Input
              placeholder="Научная деятельность"
              pattern="[а-яА-ЯёЁ\,\s?]{1,1000}"
            />
          </Form.Item>
        </> : null}
        <Form.Item label="Описание" name={["questionnaire", "description"]}>
          <TextArea rows={5} showCount maxLength={1000}
            placeholder="Научная деятельность и прочие заслуги"
            title="не более 1000 символов"
            pattern="[а-яА-ЯёЁ\,\-\s?]{1,1000}"
          />
        </Form.Item>
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
      </Form>
    </div>
  );
}
export default NewAnketa;