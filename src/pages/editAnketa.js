import "antd/dist/antd.css";
import locale from "antd/es/date-picker/locale/ru_RU.js";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
import "moment/locale/ru";
import "../App.css";
import axios from "axios";
import { array, urlget, url } from "../data/data.js";
import { Link, useHistory } from "react-router-dom";
import {
  Button, Input, Form,  DatePicker,
  Select,  InputNumber, Checkbox, Upload, message, Spin
} from "antd";
import React, { useState, useEffect } from "react";
import TextArea from "antd/lib/input/TextArea";
import AddAnketa from "./addAnketa";



const { Option } = Select;

const dateFormat = "YYYY-MM-DD";

function Anketa() {
  // for routing
  let history = useHistory()
  // Токен
  const storedJwt = localStorage.getItem("token");
   // Вращение на кнопке "сохранить"
  const [spin, setSpin] = useState(true); 
  
  //Для дополнительной анкеты
  const [dopAnketa, setTitleDopAnketa] = useState("")
  
  // Стейты для копирования файлов 
  const [fileDiplom, setFileDiplom] = useState([])

  //предварительная обработка image  Diplom и других одиночных перед отправкой
  const beforeUploadDiplom = (file, b) => {
    if (file.type !== "image/jpeg") {
      message.error({ content: `${file.name} не  jpg  файл !`, duration: 2 });
    } else if (file.size > 2000000) {
      message.error({ content: ` Размер ${file.name} больше 2 мб !`, duration: 2 });
    } else {
      var reader = new FileReader();
      reader.onloadend = function () { setFields([{ name: b, value: reader.result }]) };
      reader.readAsDataURL(file);
     
    }
  }
  const [fotoCurses, setFotoCurses] = useState([])
  // const [sel, setSel] = useState()
  const beforeUploadCurces = (file, b) => {
    // setSel(b)
    // console.log(sel)
    if (file.type !== "image/jpeg") {
      message.error({ content: `${file.name} не  jpg  файл !`, duration: 2 });
    } else if (file.size > 2000000) {
      message.error({ content: ` Размер ${file.name} больше 2 мб !`, duration: 2 });
    } else {
      var reader = new FileReader();
      reader.onloadend = function () {
        // const newImage = {"image": reader.result };
        setFotoCurses([...fotoCurses, { "image": reader.result }]);
      };
      reader.readAsDataURL(file);
    }
  }
  useEffect(() => {
    setFields([{ name: ["questionnaire", "refresherCoursesImages"], value: fotoCurses }]);
  }, [fotoCurses])
  //пропсы для отправки файла       
  const propDiplom = {
    onRemove: file => {
      const index = fileDiplom.indexOf(file);
      const newFileList = fileDiplom.slice();
      newFileList.splice(index, 1);
      setFileDiplom(newFileList);
    }
  }
 
  // данные анкеты
  //Выбор анкеты для редактирования
  const [typeAnkete, setTypeAnkete] = useState(0)
  const [form] = Form.useForm()
  const [fields, setFields] = useState()
  // определяем имя анкеты для заглавия
  // const anketaName = typeAnkete === 1 ?
  //   "в Сбер Здоровье" : typeAnkete === 2 ?
  //     "врача из клиники партнера" : typeAnkete === 3 ?
  //       "врача из регионального МО (для РГС)" : ""


  //список анкет для AXIOS
  const anketaSelect = ["c3", "clinic-partner", "mo"]
  //номер анкеты для отправки

  const [myData, setmyData] = useState({})
  

  const selectAnkete = value => {
    setTypeAnkete(value);
    if (value === 4) { return null } else {
      const userItems = Object.entries(myData.user);
      console.log(myData);
      setTimeout(() => {
        for (const [i, elem] of userItems) {
          if (i === 'phone') {
            setFields([{ name: ["user", "phone"], value: elem.substring(1) }]) ;
          } else {            
            setFields([{ name: ["user", i], value: elem }]);
          }
          console.log(i)
        }
        const items = Object.entries(
          myData.questionnaireC3 ?? 
          myData.questionnaireClinicPartner ?? 
          myData.questionnaireMo
        );
        for (const [i, elem] of items) {
          if (i === "dob") {
            setFields([{ name: ["questionnaire", "dob"], value: moment(myData.questionnaireC3.dob, "YYYY-MM-DD") }])
          } else if (i === "validCertificates") {
            setFields([{ name: ["questionnaire", "validCertificates", "dateEnd"], 
              value: moment(
                ( myData.questionnaireC3 ??
                myData.questionnaireClinicPartner ??
                myData.questionnaireMo).validCertificates.dateEnd , "YYYY-MM-DD"
              )              
            }]);
            setFields([{ name: ["questionnaire", "validCertificates", "specialization"], 
              value: ( myData.questionnaireC3 ??
                myData.questionnaireClinicPartner ??
                myData.questionnaireMo).validCertificates.specialization
                 
            }])
          }  else { 
            setFields([{ name: ["questionnaire", i], value: elem }]);
            
          }
          //console.log(i)
        }
      }, 500);
    };
  }

  const [optionsWithDisabled, setoptionsWithDisabled] = useState([])



  // принимаем анкету с сервера 

  useEffect(() => {
    
    axios.get(`${urlget}user/info`,
      {
        headers: {
          "Access-Control-Allow-Headers": "Access-Control-Allow-Credentials,Access-Control-Allow-Origin,Access-Control-Allow-Method,Content-Type,Accept,Authorization",
          "Authorization": `Bearer ${storedJwt}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Method": "GET",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": "true",
          "Accept": "application/json",
        }
      }
    )
      .then(res => {
        setmyData(res.data)
        console.log('Thie is enter data');
        console.log(res.data);      
        setoptionsWithDisabled([
          !res.data.questionnaireC3 ,
          !res.data.questionnaireClinicPartner,
          !res.data.questionnaireMo          
        ])
        if( res.data.questionnaireAdditional) {

        } else {
          setTypeAnkete(4);
          setTitleDopAnketa("Заполните дополнительную анкету")
        }
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
  }, [storedJwt, history])
  //отправляем анкету на сервер
  function ResiveAnkete(values) {
    setSpin(false)   
    let DoB = (
      values.questionnaire.dob ? values.questionnaire.dob.format(dateFormat): ""
    );
     values.questionnaire.dob = DoB;
    let DateEndCertif = (
      values.questionnaire.validCertificates.dateEnd ? 
      values.questionnaire.validCertificates.dateEnd.format(dateFormat) : ""
    );
    values.questionnaire.validCertificates.dateEnd = DateEndCertif; 
    values.user.phone = Number("7"+ values.user.phone);   
    // values.questionnaire.validCertificates.dateEnd = values.questionnaire.validCertificates.dateEnd.format(dateFormat);  
    const ank = anketaSelect[typeAnkete - 1];
    axios({
      method: "PATCH",
      url: `${url}update/${ank}`,
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

 
 
  // function disabledDateEnd(current) {
  //   // Can not select days before today and today
  //   return current && current > moment().endOf("year").subtract(1, "years");
  // }
  return (
    <div className="App">
      <Link to="/" className="App-header" title="на главную">
        <header className="App-header" />
      </Link>

      { !myData ? <Spin tip="Загружается анкета..." /> : null}

      { myData && <>  
        
          <Select style={{ width: "100%", margin: "24px 0" }} onChange={selectAnkete}
            placeholder="Выберите анкету для изменения">
            <Option disabled={optionsWithDisabled[0]} value={1}>Анкета при трудоустройстве в СберЗдоровье</Option>
            <Option disabled={optionsWithDisabled[1]} value={2}>Анкета при подключении врача из клиники партнера</Option>
            <Option disabled={optionsWithDisabled[2]} value={3}>Анкета при подключении врача из регионального МО (для РГС)</Option>
            <Option  value={4}>Дополнительная анкета</Option>
          </Select>
     
        </>
      }

      { (typeAnkete !== 0 && typeAnkete !== 4) ?
        <Form
          layout="horizontal"
          form={form}
          {...formItemLayout}
          fields={fields}
          initialValues={{ remember: true }}
          onFinish={ResiveAnkete}
        >


          {/* <p style={{ textAlign: "left", color: "red" }}>* обязательные для заполнения поля</p> */}

          {(typeAnkete !== 1 && typeAnkete !== 4) &&
            <Form.Item name={["questionnaire", "moName"]} label="Название МО"
              rules={[{
                required: true, message: "Введите название МО",
                whitespace: true
              }
              ]}
            >
              <Input
                required
                placeholder="название Мо"
                pattern="[-а-яА-ЯёЁ\s]{3,40}"
                title="русскими буквами"
              />
            </Form.Item>
          }
          <h3><b>Общая информация о враче</b></h3>
          <Form.Item label="* ФИО" layout="inline" style={{ height: 30 }} rules={[{ required: true }]}>
            <Form.Item style={{ width: "30%", display: "inline-block" }}
              name={["user", "fullName", "last"]}
              rules={[{
                required: true, message: "Фамилия",
                whitespace: false
              }]}
            >
              <Input
                required
                title="русскими буквами"
                placeholder="Фамилия"
                pattern="[-а-яА-ЯёЁ]{1,15}"
              />
            </Form.Item>
            <Form.Item name={["user", "fullName", "first"]}
              style={{ width: "30%", display: "inline-block", margin: "0 5%" }}
              rules={[{
                required: true, message: "Имя",
                whitespace: false
              }]}
            >
              <Input
                placeholder="Имя"
                required
                title="русскими буквами"
                pattern="[-а-яА-ЯёЁ]{2,15}"
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
                pattern="[-а-яА-ЯёЁ]{3,15}"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Email" name={["user", "email"]}
            rules={[{ required: true, message: "Введите валидный email" }]}
          >
            <Input
              placeholder="Email"
              required
              pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            />
          </Form.Item>
          <Form.Item label="Телефон" name={["user", "phone"]}
            rules={[{ required: true, message: "Введите ваш телефон в формате: 10 цифр без пробелов и тире!" }]}

          >
            <Input
              placeholder="XXXXXXXXXX"
              title="10 цифр без пробелов и тире"
              maxLength={10}              
              addonBefore="+7"
              pattern="[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}"
            />
          </Form.Item>
          <Form.Item label="Снилс" name={["user", "insuranceNumber"]}
            rules={[{ required: true, message: "Введите ваш СНИЛС" }]}
          >
            <Input.Password
              placeholder="ХХХХХХХХХХХ"
              maxLength={11}
              title="11 цифр без пробелов и тире"
              pattern="[0-9]{3}[0-9]{3}[0-9]{3}[0-9]{2}"
            />
          </Form.Item>
          <Form.Item label="Город проживания" name={["user", "city"]}
            rules={[{ required: true, message: "Введите город проживания" }]}
          >
            <Input
              title="русскими буквами"
              placeholder="Город проживания"
              pattern="[а-яёА-ЯЁ-]{1,15}"
            />
          </Form.Item>
          {typeAnkete === 3 ?
          <Form.Item label=" Cпециальность" name={["questionnaire", "specialty"]}
            rules={[{ required: true, message: "Введите  специальность" }]}
          >
            <Select
              showSearch
              pattern="[а-яёА-ЯЁ-]{1,35}"
              placeholder="Выберите специальность"
            >
              { array.map(i => <Option key={i} value={i}>{i}</Option>) }
            </Select>
          </Form.Item> : ""}
          {typeAnkete !== 3 ? <>
            <Form.Item label="Дата рождения" name={["questionnaire", "dob"]}
              rules={[{ required: true, message: "Выберите дату рождения" }]}
            >
              <DatePicker 
                placeholder="Дата рождения"
                format="YYYY-MM-DD" 
                locale={locale}
              />
            </Form.Item> 

          <Form.Item label="Основная специальность" name={["questionnaire", "mainSpecialty"]}
            rules={[{ required: true, message: "Введите основную специальность" }]}
          >
            <Select
              showSearch
              pattern="[а-яёА-ЯЁ-]{1,35}"
              placeholder="Выберите специальность"
            >
              {array.map(i => <Option value={i}>{i}</Option>)}

            </Select>
          </Form.Item>           
            <Form.Item label="Дополнительная специальность" name={["questionnaire", "additionalSpecialty"]}>
              <Input
                placeholder="Дополнительная специальность"
                pattern="[а-яёА-ЯЁ]{1,15}"
              />
            </Form.Item>
          <Form.Item label="Специализация" name={["questionnaire", "specialization"]}>
            <Input
              placeholder="Специализация"
              pattern="[а-яёА-ЯЁ-,]{1,25}"
            />
          </Form.Item>    

            <Form.Item label="Какой ведете прием" name={["questionnaire", "physicianAppointment", "type"]}
             
              rules={[{ required: true, message: "Выберите тип приема" }]}
            >
              <Select  placeholder="Вид приема">
                <Option  value={1}>Детский</Option>
                <Option  value={2}>Взрослый</Option>
              </Select>
            </Form.Item>
            <Form.Item noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.questionnaire !== currentValues.questionnaire}
            >
              {({ getFieldValue }) =>
                getFieldValue(["questionnaire", "physicianAppointment", "type"]) === 1 ?
                  <Form.Item label="C какого возраста" 
                    name={["questionnaire", "physicianAppointment", "patientAge"]}>
                    <InputNumber
                      placeholder="Возраст"
                      min={1}
                      max={18}
                      initialvalue={1}
                    />

                  </Form.Item> : null
              }
            </Form.Item>
          </> : ""}
          <Form.Item label="Год начала врачебной практики"
            name={["questionnaire", "startMedicalPractice"]}
          >
            <InputNumber
              initialvalue={1970}
              placeholder="Год"
              min={1970}
              max={2020}
            />
          </Form.Item>
          <Form.Item label="Фото диплома" name={["questionnaire", "diploma", "image"]}>
            <Input className="inputFoto" />
            <Upload {...propDiplom} status="done" accept="image/jpeg" maxCount="1"
              beforeUpload={e => beforeUploadDiplom(e, ["questionnaire", "diploma", "image"])}
            >            
              <Button><UploadOutlined />Выберите файл</Button>               
             
            </Upload>
          </Form.Item>

          {typeAnkete === 3 ? <>            
              <h3><b>Действительный сертификат по специальности</b></h3>
              <Form.Item label="Специальность" name={["questionnaire", "validCertificates", "specialization"]}
                rules={[{ required: true, message: "Введите сертификат" }]}
              >
                <Input
                  placeholder="Специальность"
                  pattern="[а-яА-ЯёЁ,- ]{1,}"
                />
              </Form.Item>
              <Form.Item label="Дата окончания"
                name={["questionnaire", "validCertificates", "dateEnd"]}
                rules={[{ required: true }]}
              >
             
                <DatePicker
                  placeholder="Дата окончания"                  
                  format="YYYY-MM-DD" 
                  locale={locale}              
                />
              </Form.Item>
              <Form.Item label="Фото сертификата" name={["questionnaire", "validCertificatesImage"]}>
                <Input className="inputFoto" />
                <Upload {...propDiplom} status="done" accept="image/jpeg" maxCount="1"
                  beforeUpload={e => beforeUploadDiplom(e, ["questionnaire", "diploma", "image"])}
                >            
                  <Button><UploadOutlined />Выберите файл</Button>               
                </Upload>
              </Form.Item>              
              <Form.Item label="Расписание работы" name={["questionnaire", "workSchedule"]}>
                <Input
                  placeholder="Расписание работы"
                  pattern="[а-яА-Я0-9,- ]{1,}"
                />
              </Form.Item>  </>
              : null
            }
         
          {typeAnkete !== 3 ? <>
            <h3><b>Базовое образование</b></h3>
            <Form.Item label="Год окончания"
              name={["questionnaire", "basicEducation", "yearStart"]}>
              <InputNumber
                initialvalue={1970}
                placeholder="Год"
                min={1970}
                max={2020}
              />
            </Form.Item>
            <Form.Item label="Название учреждения"
              name={["questionnaire", "basicEducation", "institutionName"]}>
              <Input
                placeholder="Название учреждения"
                pattern="[а-яА-Я,- ]{1,15}"
              />
            </Form.Item>
            <Form.Item label="Специализация"
              name={["questionnaire", "basicEducation", "specialization"]}>
              <Input
                placeholder="Специализация"
                pattern="[а-яА-Я,- ]{1,15}"

              />
            </Form.Item>
            <Form.Item label="Город" name={["questionnaire", "basicEducation", "city"]}>
              <Input
                placeholder="Город"
                pattern="[а-яА-ЯёЁ-]{1,15}"
              />
            </Form.Item>
            <h3><b>Интернатура/Ординатура</b></h3>
            <Form.Item label="Год окончания" 
              name={["questionnaire", "internshipTraineeship", "yearEnd"]} 
            >
              <InputNumber
                initialvalue={1970}
                placeholder="Год"
                min={1970}
                max={2020}
              />
            </Form.Item>
            <Form.Item label="Название учреждения" 
              name={["questionnaire", "internshipTraineeship", "institutionName"]}
            >
              <Input
                placeholder="Название учреждения"
                pattern="[а-яА-ЯёЁ-№]{1,15}"
              />
            </Form.Item>
            <Form.Item label="Специализация" 
              name={["questionnaire", "internshipTraineeship", "specialization"]}
            >
              <Input
                placeholder="Специализация"
                pattern="[а-яА-ЯёЁ,- ]{1,15}"
              />
            </Form.Item>
            <Form.Item label="Город" name={["questionnaire", "internshipTraineeship", "city"]}>
              <Input
                placeholder="Город"
                pattern="[-а-яА-ЯёЁ-]{3,25}"
              />
            </Form.Item>
            <h3><b>Аспирантура/Докторантура</b></h3>
            <Form.Item label="Год окончания" 
              name={["questionnaire", "graduateSchoolDoctorate", "yearEnd"]} 
            >
              <InputNumber
                min={1970}
                maxLength={4}
                max={2020}
              />
            </Form.Item>
            <Form.Item label="Название учреждения" 
              name={["questionnaire", "graduateSchoolDoctorate", "institutionName"]}
            >
              <Input
                placeholder="Название учреждения"
                pattern="[-а-яА-ЯёЁ №]{1,15}"

              />
            </Form.Item>
            <Form.Item label="Специализация" 
              name={["questionnaire", "graduateSchoolDoctorate", "specialization"]}
            >
              <Input
                placeholder="Специализация"
                pattern="[-а-яА-ЯёЁ ]{1,}"

              />
            </Form.Item>
            <Form.Item label="Город" name={["questionnaire", "graduateSchoolDoctorate", "city"]}>
              <Input
                placeholder="Город"
                pattern="[-а-яА-ЯёЁ]{1,15}"
              />
            </Form.Item>

            <h3><b>Действующие сертификаты</b></h3>

            <Form.Item label="Сертификат" 
              name={["questionnaire", "validCertificates", "specialization"]}
              rules={[{ required: true, message: "Добавить сертификат", whitespace: true }]}
            >
              <Input
                placeholder="Название сертификата"
                pattern="[а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
            <Form.Item label="Год окончания" 
              name={["questionnaire", "validCertificates", "dateEnd"]}
              rules={[{ required: true }]}
            >
              <DatePicker placeholder="Год окончания"
                format={dateFormat} 
                locale={locale}
               
              />

            </Form.Item>
            <Form.Item label="Фото сертификата" name={["questionnaire", "validCertificatesImage"]}>
              <Input className="inputFoto" />
              <Upload {...propDiplom} status="done"
                beforeUpload={(e) => beforeUploadDiplom(e, ["questionnaire", "validCertificatesImage", "image"])}
              >
                <Button><UploadOutlined />Выберите файл</Button>
              </Upload>
            </Form.Item>

            
            <h3><b>Курсы повышения квалификации,семинары, мастерклассы</b></h3>


            <Form.Item label="Год окончания" name={["questionnaire", "refresherCourses", "yearEnd"]}>

              <InputNumber
                placeholder="Год"
                pattern="[0-9,]{1,}"
                maxLength={4}
                minLength={4}

              />
            </Form.Item>
            <Form.Item label="Наименования курсов" name={["questionnaire", "refresherCourses", "courseName"]}>
              <Input
                placeholder="Наименование курсов"
                pattern="[а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
            <Form.Item label="Наименование учреждения" name={["questionnaire", "refresherCourses", "institutionName"]}>
              <Input
                placeholder="Наименование учреждения"
                pattern="[-а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
            <Form.Item label="Специальность" name={["questionnaire", "refresherCourses", "specialization"]}>
              <Input
                placeholder="Специальность"
                pattern="[а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
            <Form.Item label="Фото курсов" name={["questionnaire", "refresherCoursesImages"]} >
              <Input className="inputFoto" />
              <Upload {...propDiplom} status="done" beforeUpload={(e) => beforeUploadCurces(e, ["questionnaire", "refresherCoursesImages"])}
              >
                <Button><UploadOutlined />Выберите файл
                    </Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Врачебная категория" name={["questionnaire", "medicalCategory"]}>
              <Input
                placeholder="Врачебная категория"
                pattern="[а-яА-ЯёЁ,- ]{1,25}"
              />
            </Form.Item>
            <Form.Item label="Ученая степень" name={["questionnaire", "academicDegree"]}>
              <Input
                placeholder="Ученая степень"
                pattern="[а-яА-ЯёЁ,-]{1,}"
              />
            </Form.Item>
            <Form.Item label="Членство в профессиональных организациях" style={{lineHeight:"16px"}}
              name={["questionnaire", "tradeUnionMembership"]}
            >
              <Input
                placeholder="Наименование организации"
                pattern="[а-яА-ЯёЁ,.:- ]{1,50}"
              />
            </Form.Item>

            <Form.Item label="Опыт работы" name={["questionnaire", "experience"]} >
              <TextArea rows={7} showCount maxLength={1000}
                placeholder="Год начала, год окончания, наименование организации, специальность"
                pattern="[а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
            <Form.Item label="Награды" name={["questionnaire", "awards"]}>
              <Input
                placeholder="Награды"
                pattern="[а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
            <Form.Item label="Фиксированые достижения" name={["questionnaire", "fixedAchievements"]}>
              <Input
                placeholder="Фиксированые достижения"
                pattern="[а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
            <Form.Item label="Научная деятельность" name={["questionnaire", "scientificActivity"]}>
              <Input
                placeholder="Научная деятельность"
                pattern="[а-яА-ЯёЁ,- ]{1,}"
              />
            </Form.Item>
          </> : null}
          <Form.Item label="Описание" name={["questionnaire", "description"]} >
            <TextArea rows={5} showCount maxLength={1000}
              placeholder="Научная деятельность и прочие достижения"
              pattern="[а-яА-ЯёЁ,-: ]{1,1000}"
              title="не более 1000 символов"
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
        : typeAnkete === 4 ? <AddAnketa text={dopAnketa} /> : null}

    </div>
  );
}
export default Anketa;