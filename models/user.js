var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var objectId=Schema.ObjectId;

var UserSchema=new Schema({
	 name:{type:String},//��½��
	 password:{type:String},//����
	 email:{type:String},//�����ַ
	 //peronal_page:{type:String},//������ҳ��ַ
	 head_portrait:{type:String},//ͷ���ȡ��ַ
	 sex:String,//�Ա�
	 age:Number,//����
	 birthday:String,//����
	 collect_cassette_count:{type:Number,default:0},//�ղص����ֺ�����
	 friends_count:{type:Number,default:0},//���ѵ�����
	 countOfat:{type:Number,default:0},//��@������
	 at:[{"topicId":objectId}],//��֮��ص����£�����Ϊ100
	 unDealedMessage:{type:Number,default:0},//δ�������Ϣ����
	 friendsGroup:[{"groupName":String,"members":[]}]
});

UserSchema.index({age:-1});
UserSchema.index({name:1});

mongoose.model("User",UserSchema);