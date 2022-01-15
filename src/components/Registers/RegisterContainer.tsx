import React, {FC, useEffect, useState} from 'react';
import Register from "./Register";
import Unit from "../Unit";
import RegisterObject from "../../Types/RegisterType";
import {splitWhitespace} from "../../utils";
import {destructureRtnCell} from "../../assemblyExecution";
import Registers from "../../constants/Registers";
import "./styles.css";

interface Props {
    registers: RegisterObject[];
    currentRtn: string;
}

const animationLength = 200;

const RegisterContainer: FC<Props> = ({registers, currentRtn}) => {

        const [animatedMap, setAnimated] = useState<Map<string, boolean>>(() => {
            let registerMap: Map<string, boolean> = new Map();
            Registers.forEach(register => registerMap.set(register.name, false));
            return registerMap;
        });

        useEffect(() => {
            if (!currentRtn) return;
            const rtnParts = splitWhitespace(currentRtn);
            const receivingCell = destructureRtnCell(rtnParts[0])[0];
            animatedMap.forEach((value, key) => {
                if(key === receivingCell){
                    animateRegister(receivingCell);
                    return;
                }
            })
        }, [currentRtn])

        const updateRegisterState = (registerName: string, newAnimatedState: boolean) => setAnimated(oldMap => {
            let newMap: Map<string, boolean> = new Map();
            oldMap.forEach((oldValue, key) => newMap.set(key, key === registerName ? newAnimatedState : oldValue));
            return newMap;
        })


        const animateRegister = (registerName: string) => {
            updateRegisterState(registerName, true);
            setTimeout(() => updateRegisterState(registerName, false), animationLength);
        }

        const getRegisterClassName = (registerName: string): string => {
            if (!animatedMap.get(registerName)) return registerName;
            return registerName + " animated";
        }

        return (
            <div className="registers-container">
                {registers.map(
                    (register) =>
                        <div key={register.name} id={register.name} className={getRegisterClassName(register.name)}>
                            <Register
                                registerObj={register}
                            />
                        </div>
                )}

                <div id="CU" className="CU"><Unit name="CU"/></div>
                <div id="ALU" className="ALU"><Unit name="ALU"/></div>
            </div>
        );
    }
;

export default RegisterContainer;
