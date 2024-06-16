import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import { UserRole } from "./user.constant";

const userSchema = new Schema<TUser>({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: UserRole, 
        default: 'user' 
    }
  },
  {
   timestamps: true
  }
);

  export const User = model<TUser>("User", userSchema)