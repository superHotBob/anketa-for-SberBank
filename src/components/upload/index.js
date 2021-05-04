import "antd/dist/antd.css";
import { UploadOutlined } from "@ant-design/icons";
import "moment/locale/ru";
import "../../App.css";
import { Button, Input, Form, Upload } from "antd";
import React, { useState } from "react";


const UploadFile = (props) => {

    // Стейты для копирования файлов 
    const [fileImage, setFileImage] = useState([])
    const onRemoveDiplom = (file, b) => {
        console.log(fileImage.length);
        const index = fileImage.indexOf(file);
        const newFileList = fileImage.slice();
        newFileList.splice(index, 1);
        setFileImage(newFileList);
        props.setFields([{ name: b, value: "" }])
    }   
   
    //пропсы для отправки файла       
    const prop = {
        onRemove: file => {
            const index = fileImage.indexOf(file);
            const newFileList = fileImage.slice();
            newFileList.splice(index, 1);
            setFileImage(newFileList);
        }
    }       
    return (
        <Form.Item  label={props.label} name={["questionnaire", props.name, "image"]}
            rules={[{required: true, message:`Выберите файл ${props.label}`}]} 
            shouldUpdate={(prevValues, currentValues) => prevValues.questionnaire !== currentValues.questionnaire} 
        >
            <Input className="inputFoto" />
        
            <Upload {...prop} status="done"
                accept="image/jpeg"
                maxCount="1"
                onRemove={e => onRemoveDiplom(e, ["questionnaire", props.name, "image"])}
                beforeUpload={(e) => props.beforeUploadAdd(e, ["questionnaire", props.name, "image"])}
            >
                <Button disabled={fileImage.length>0}>
                    <UploadOutlined />
                    Выберите файл
                </Button>
            </Upload>
        </Form.Item>
    )
}
export default UploadFile;